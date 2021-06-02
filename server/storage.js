"use strict"

const fs = require("fs")
const path = require("path")

module.exports = function (parsedUrl, req, res) {
    // sanitizedPath prevents folder change by user and substracts "storage/" from path
    // ATTENTION: sanitizedPath returns path with backslashes "\" instead of slash "/"
    const sanitizedPath = path.normalize(parsedUrl.pathname.substr(9)).replace(/^(\.\.[\/\\])+/, '')
    if (sanitizedPath === "saveNewMaintenance") {
        const relativePath = "./dist/Aquariumpflege.json"
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            data = JSON.parse(data)
            data = data.maintenanceList
            addToStorage(res, data, relativePath)
        })
        return
    }
    if (sanitizedPath === "getMaintenanceStorage") {
        const relativePath = "./dist/Aquariumpflege.json"
        return getStorageData(res, relativePath)
    }
    if (sanitizedPath === "getStock") {
        const relativePath = "./dist/Bestandsliste.json"
        getStorageData(res, relativePath)
        return
    }
}


function addToStorage(res, data, relFilePath) {
    if (data.length === 0) {
        res.writeHead(422, { "Content-Type": "text/plain; charset=utf-8" })
        res.write("Error 422: Übermittelte Daten konnten nicht verarbeitet werden!")
        res.end()
        return
    }
    fs.readFile(relFilePath, (err, fileData) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.write("Internal Server Error 500: Die bestehenden Daten konnten nicht eingelesen werden")
            res.end()
            return
        }
        fileData = JSON.parse(fileData)
        for (const obj of data) {
            fileData.push(obj)
        }
        fs.writeFile(relFilePath, JSON.stringify(fileData), (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" })
                res.write("Internal Server Error 500: Daten konnten nicht gespeichert werden")
                res.end()
                return
            }
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.write("Daten erfolgreich gespeichert")
            res.end()
        })
    });
    return
}

function getStorageData(res, relFilePath) {
    fs.readFile(relFilePath, (err, fileData) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.write("Internal Server Error 500: Die bestehenden Daten konnten nicht eingelesen werden")
            res.end()
            return
        }
        fileData = JSON.parse(fileData)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.write(JSON.stringify(fileData))
        res.end()
    });
    return
}
