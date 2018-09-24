var http = require("http");
var url = require("url");
//var router = require("./router")

function startserver(){
function onRequest(request, response) {
  var pathname = url.parse(request.url).pathname;
  var now = new Date();
  now = now.toLocaleString("ru");
  console.log(now + " Request for http://" + host + ":" + port + pathname + " recieved");
  //router.route(pathname);
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

var port = 80;
var host = "127.0.0.1";
var server = http.createServer(onRequest);
server.listen(port, host);

console.log("Server started successfully. Listening requests on port " + port + ".");
}

startserver();
exports.startserver = startserver
