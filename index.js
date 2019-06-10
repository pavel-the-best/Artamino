const server = require("./server.js");
const router = require("./router.js");
const requestHandlers = require("./requesthandlers.js");
const MongoClient = require("mongodb").MongoClient;

let handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/style.css"] = requestHandlers.style;
handle["/register"] = requestHandlers.register;
handle["/login"] = requestHandlers.login;
handle["/bootstrap.css"] = requestHandlers.bootstrapCSS;
handle["/bootstrap.css.map"] = requestHandlers.bootstrapCSSMap;
handle["/bootstrap.js"] = requestHandlers.bootstrapJS;
handle["/bootstrap.js.map"] = requestHandlers.bootstrapJSMap;
handle["/jquery-3-3-1.min.js"] = requestHandlers.Jquery;
handle["/regr"] = requestHandlers.regr;
handle["/logn"] = requestHandlers.logn;
handle["/script"] = requestHandlers.script;

let hostList = [];
hostList[0] = "192.168.0.115";
hostList[1] = "127.0.0.1" ;
hostList[2] = "localhost";
hostList[3] = "10.6.107.184";
hostList[4] = "192.168.100.93";
hostList[5] = "172.18.109.182";
hostList[6] = "pavelk.herokuapp.com";
hostList[7] = "185.30.228.140";
hostList[8] = "0.0.0.0";

const host = hostList[8];
const port = process.env.PORT || 8080;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/";

let client = undefined;
let db = undefined;
let collections = {};


async function getClient() {
	try {
		const result = client || await MongoClient.connect(url, {useNewUrlParser: true});
		client = result;
		return result;
	} catch(err) {
		throw err;
	}
}

async function getCollection(name) {
	try {
		await getClient();
		db = db || client.db("auth");
		if (name in collections) {
			return collections[name];
		} else {
			collections[name] = await db.collection(name);
			return collections[name];
		}
	} catch(err) {
		throw err;
	}
}

getClient();
getCollection("user");
getCollection("session");
server.startserver(router.route, handle, host, port);

exports.getClient = getClient;
exports.hostList = hostList;
exports.getCollection = getCollection;
