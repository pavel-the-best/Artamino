const http = require("http");
const url = require("url");
const fs = require("fs");
const router = require("./router.js");

function startserver(route, handle, host, port) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var now = new Date();
    now = now.toLocaleString("ru");
    console.log(now + " Request for http://" + host + ":" + port + pathname + " recieved");
    route(pathname, handle, response);
  };
  var server = http.createServer(onRequest);
  server.listen(port, host);
  console.log("Server started successfully. Listening requests on  " + host + ":" + port + ".");
}

exports.startserver = startserver;
