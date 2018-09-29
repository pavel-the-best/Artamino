var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/style.css"] = requestHandlers.style;

var host = "127.0.0.1";
var port = 80;

server.startserver(router.route, handle, host, port);
