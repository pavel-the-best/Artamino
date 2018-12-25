const server = require("./server.js");
const router = require("./router.js");
const requestHandlers = require("./requesthandlers.js");
const MongoClient = require("mongodb").MongoClient;

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/style.css"] = requestHandlers.style;
handle["/register"] = requestHandlers.register;
handle["/bootstrap.css"] = requestHandlers.bootstrapCSS;
handle["/bootstrap.css.map"] = requestHandlers.bootstrapCSSMap;
handle["/bootstrap.js"] = requestHandlers.bootstrapJS;
handle["/jquery-3-3-1.min.js"] = requestHandlers.Jquery;

var hostList = [];
hostList[0] = "192.168.0.115";
hostList[1] = "127.0.0.1" ;
hostList[2] = "localhost";
hostList[3] = "10.6.107.184";
hostList[4] = "192.168.100.93";
hostList[5] = "172.18.109.182";
hostList[6] = "pavelk.herokuapp.com";
hostList[7] = "185.30.228.140";
hostList[8] = "0.0.0.0"

const host = hostList[8];
const port = process.env.PORT || 3000;
const url = "mongodb://localhost:27017/";

var client = undefined;
var db = undefined;
var collection = undefined;


async function getClient() {
	var result = client || await MongoClient.connect(url, {useNewUrlParser: true});
	client = result;
	return result;
};

async function getCollection() {
	await getClient();
	db = db || client.db("auth");
	collection = collection || db.collection("user");
	return collection;
};

server.startserver(router.route, handle, host, port);

exports.getClient = getClient;
exports.hostList = hostList;
exports.getCollection = getCollection;
