const index = require("./index.js")
const bcrypt = require("bcrypt");

const saltRounds = 11;

async function createUser(name, textpassword, firstname, lastname) {
	var user = await index.getCollection();
	const query = {
		username: name
	}
	var tryuser = await user.find(query).toArray();
	if (tryuser.length == 0) {
		var hash = await bcrypt.hash(textpassword, saltRounds);
		const theuser = {
			username: name,
			password: hash,
			first_name: firstname,
			last_name: lastname
		};
		var result = await user.insertOne(theuser);
		console.log("user " + name + " successfully created");
		return 0;
	} else {
		return 1;
	};
};

async function checkPassword(name, passwordtocheck) {
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
