const http = require("http");
const url = require("url");
const router = require("./router.js");

function startserver(route, handle, host, port) {
  function onRequest(request, response) {
    const pathname = url.parse(request.url).pathname;
    const d = new Date();
    const now = d.toLocaleString("ru");
    console.log(now + " " + request.method + " Request for http://" + host + ":" + port + pathname + " recieved");
    router.route(pathname, handle, request, response);
  }
  const server = http.createServer(onRequest);
  server.listen(port, host);
  console.log("Server started successfully. Listening requests on  " + host + ":" + port + ".");
}

exports.startserver = startserver;
