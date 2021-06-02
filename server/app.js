"use strict"


const http = require("http")
const fs = require("fs")
const path = require("path")
const url = require("url")
const servePublic = require("./public")
const serveStorage = require("./storage")


const app = http.createServer((req, res) => {
    console.log("Serveranfrage: ", req.url);
    try {
        if (req.url === "/") {
            const relIndexHTMLPath = ("./dist/index.html")
            fs.readFile(relIndexHTMLPath, (err, content) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
                    res.write("Error 500: Es ist ein Fehler aufgetreten")
                    res.end()
                    return
                }
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
                res.write(content)
                res.end()
            })
            return
        }

        const parsedUrl = url.parse(req.url)

        if (parsedUrl.pathname.substr(0, 8) === "/public/") {
            return servePublic(parsedUrl, res)
        }
        if (parsedUrl.pathname.substr(0, 9) === "/storage/") {
            return serveStorage(parsedUrl, req, res)
        }
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
        res.write("Error 404: Datei wurde nicht gefunden!")
        res.end()
    }
    catch (error) {
        try {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
            res.write("Error 500: Ein interner Fehler ist aufgetreten!")
            res.end()
        } catch (e) { }
    }

})

app.listen(8090)