var server = require("./server.js");
var router = require("./router.js");
var requestHandlers = require("./requesthandlers.js");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/style.css"] = requestHandlers.style;
handle["/register"] = requestHandlers.register;
handle["/bootstrap.css"] = requestHandlers.bootstrapCSS;
handle["/bootstrap.css.map"] = requestHandlers.bootstrapCSSMap;

var hostList = [];
hostList[0] = "192.168.0.115";
hostList[1] = "127.0.0.1" ;
hostList[2] = "localhost";
hostList[3] = "10.6.107.184";
hostList[4] = "192.168.100.93";
hostList[5] = "172.18.109.182";

var host = hostList[5];
var port = 80;

server.startserver(router.route, handle, host, port);

exports.hostList = hostList;
