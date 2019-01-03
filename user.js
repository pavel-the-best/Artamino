const index = require("./index.js")
const bcrypt = require("bcrypt");

const saltRounds = 11;

async function createUser(request, name, textpassword, firstname, lastname) {
	try {
		var user = await index.getCollection("user");
		const query = {
			username: name
		};
		var tryuser = await user.find(query).toArray();
		if (tryuser.length == 0) {
			var hash = await bcrypt.hash(textpassword, saltRounds);
			const theuser = {
				username: name,
				password: hash,
				first_name: firstname,
				last_name: lastname
			};
			await user.insertOne(theuser);
			console.log("user " + name + " successfully created");
			var auth = await index.getCollection("auth");
			const authQuery = {
				ip: request.headers['X-Forwarded-For'] || request.connection.remoteAddress || request.socket.remoteAddress || "ERR",
				user_agent: request.headers['user-agent'],
				user_id: theuser._id
			};
			await auth.insertOne(authQuery);
			return 0;
		} else {
			return 1;
		};
	} catch(err) {
		throw err;
	}
};

async function checkPassword(request, name, passwordtocheck) {
	try {
		var user = await index.getCollection()
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
			return(allresult);
		} catch(err) {
			throw err;
		}
	} catch(err) {
		throw(err);
	};
};


exports.createUser = createUser;
exports.checkPassword = checkPassword;
