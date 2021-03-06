const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end(`Bad request`);
      } else {
        try {
          fs.accessSync(filepath)
          res.statusCode = 409;
          res.end(`File already exists`);
        } catch(err) {
          req.on(`close`, () => {
              if (req.aborted) {
                fs.unlinkSync(filepath);
                res.statusCode = 500;
                res.end(`Connection aborted`)
              };
            })
            .pipe(new LimitSizeStream({limit: 1048576}))
            .on(`error`, err => {
              fs.unlinkSync(filepath);
              res.statusCode = 413;
              res.end(`Big file`);
            })
            .pipe(fs.createWriteStream(filepath))
            .on('error', err => {
              res.statusCode = 500;
            })
            .on(`close`, () => {
            res.statusCode = 201;
            res.end(`closed`);
          });
        }
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
