const server = require("./server.js");
const router = require("./router.js");
const requestHandlers = require("./requesthandlers.js");
const MongoClient = require("mongodb").MongoClient;

let handle = {};
handle["/regr"] = requestHandlers.regr;
handle["/logn"] = requestHandlers.logn;
handle["/logout"] = requestHandlers.logOut;
handle["/createMessage"] = requestHandlers.createMessage;
handle["/getAllMessages"] = requestHandlers.getAllMessages;
handle["/getMessages"] = requestHandlers.getMessages;

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 8080;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/";

let client = undefined;
let dbs = {};
let db = undefined;
let collections = {};


async function getClient() {
  try {
    const result = client || await MongoClient.connect(url, {useNewUrlParser: true});
    client = result;
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function getDB(name) {
  try {
    client = await getClient();
    if (name in dbs) {
      return dbs[name];
    } else {
      dbs[name] = await client.db(name);
      return dbs[name]
    }
  } catch (err) {
    console.error(err);
  }
}

async function getCollection(dbName, name) {
  try {
    await getClient();
    db = await getDB(dbName);
    if (dbName in collections) {
      if (name in collections[dbName]) {
        return collections[dbName][name];
      } else {
        collections[dbName][name] = await db.collection(name);
        return collections[dbName][name];
      }
    } else {
      collections[dbName] = {};
      collections[dbName][name] = await db.collection(name);
    }
  } catch (err) {
    console.error(err);
  }
}

getClient();
getDB("auth");
getDB("message");
getCollection("auth", "user");
getCollection("auth", "auth");
getCollection("message", "message");

server.startServer(router.route, handle, host, port);

exports.getClient = getClient;
exports.getDB = getDB;
exports.getCollection = getCollection;
