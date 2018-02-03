const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const ROOT = __dirname + '/frontend/'

http.createServer((req, res) => {
  sendFileSafe(url.parse(req.url).pathname, res)
}).listen(3000)

function sendFileSafe(filepath, res) {
  if (filepath === '/') filepath = '/index.html'
  try {
    filepath = decodeURIComponent(filepath)
  } catch(e) {
    res.statusCode = 400
    res.end('bad request!')
    return
  }

  filepath = path.normalize(path.join(ROOT, filepath))
  if (filepath.indexOf(ROOT) != 0) {
    res.statusCode = 400
    res.end('bad request!')
    return
  }

  fs.stat(filepath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404
      res.end('page not found!')
      return
    }
    sendFile(filepath, res)
  })

}

function sendFile(filepath, res) {
  const file = new fs.ReadStream(filepath)

  res.setHeader('Content-Type', mime.lookup(filepath) + "; charset=utf-8")
  file.pipe(res)

  file.on('error', () => {
    res.statusCode = 500
    res.end('server error!')
    return
  })

  res.on('close', () => file.destroy())

}