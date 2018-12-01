const hostList = require("./index.js").hostlist;
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const csrf = require("csrf");

const url = "mongodb+srv://admin:adminPassword@cluster0-br06w.gcp.mongodb.net";

async function createUser(name, textpassword) {
	var client = await MongoClient.connect(url, { useNewUrlParser: true });
	var auth = client.db("auth");
	var user = auth.collection("user");
	const query = {
		username: name
	}
	var tryuser = await user.find(query).toArray();
	if (tryuser.length == 0) {
		var hash = await bcrypt.hash(textpassword, 11);
		const theuser = {
			username: name,
			password: hash
		};
		var result = await user.insertOne(theuser);
		console.log("user " + name + " successfully created");
		client.close();
		return 0;
	} else {
		client.close();
		return 1;
	};
};

async function checkPassword(name, passwordtocheck) {
	try {
		var client = await MongoClient.connect(url, { useNewUrlParser: true });
		var auth = client.db("auth");
		var user = auth.collection("user");
		var query = {
			username: name
		};
		try {
			var searchresult = await user.find(query).limit(1).toArray();
			if (searchresult.length > 0) {
				allresult = await bcrypt.compare(passwordtocheck, searchresult[0]["password"]);
			} else {
				allresult = false;
			};
			client.close();
			return(allresult);
		} catch(err) {
			client.close();
			console.log(err);
			throw err;
		}
	} catch(err) {
		console.log(err);
		throw(err);
	};
};


exports.createUser = createUser;
exports.checkPassword = checkPassword;
