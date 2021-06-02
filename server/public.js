"use strict"

const path = require("path")
const mimeTypes = require("mime-types")
const fs = require("fs")


module.exports = function (parsedUrl, res) {
    // sanitizedPath prevents folder change by user and substracts "public/" from path
    const sanitizedPath = path.normalize(parsedUrl.pathname.substr(7)).replace(/^(\.\.[\/\\])+/, '')
    // create absolute path for requested path
    const absolutePath = path.join(__dirname, "..", "dist", sanitizedPath)
    fs.exists(absolutePath, (exists) => {
        if (!exists) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
            res.write("404 not found")
            res.end()
            return
        }
        fs.readFile(absolutePath, (err, content) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
                res.write("500 Internal Server Error")
                res.end()
                return
            }
            // mimeTypes automatically creates matching header for requested filetype
            res.writeHead(200, { "Content-Type": mimeTypes.lookup(sanitizedPath) })
            res.write(content)
            res.end()
        })
    })
}