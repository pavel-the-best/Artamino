const http2 = require("http2");
const https = require("https");
const http = require("http");
const fs = require("fs");
const url = require("url");
const router = require("./router.js");

let options = {};

if (!process.env.DEBUG) {
  options = {
    key: fs.readFileSync("/etc/letsencrypt/live/pavelthebest.cf/privkey.pem", "utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/pavelthebest.cf/fullchain.pem", "utf8")
  };
}

function startServer(route, handle, host, port) {
  async function onRequest(request, response) {
    const pathname = url.parse(request.url).pathname;
    const d = new Date();
    const now = d.toLocaleString("ru");
    console.log(now + " " + request.method + " Request for http://" + host + ":" + port + pathname + " recieved");
    await router.route(pathname, handle, request, response);
  }

  try {
    const server = http.createServer(onRequest);
    server.listen(port, host);
    if (!process.env.DEBUG) {
      const secureServer = https.createServer(options, onRequest);
      secureServer.listen(9443, host);
    }
    console.log("Server started successfully. Listening requests on  " + host + ":" + port + ".");
  } catch(err) {
    throw err;
  }
}

exports.startServer = startServer;
