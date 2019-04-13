const index = require("./index.js")
const bcrypt = require("bcrypt");

function parseCookies (request) {
    cookies = request.headers.cookie;
    cookies.split(';');
    d = {};
    for (i in cookies) {
      cur = cookies[i].split('=');
      d[cur[0]] = cur[1];
    }
    return d;
}

const saltRounds = 11;

async function createUser(request, name, textpassword, firstname, lastname) {
	try {
		var user = await index.getCollection("user");
		const query = {
			username: name
		};
		var tryuser = await user.find(query).toArray();
		if (tryuser.length == 0) {
			var hashP = await bcrypt.hash(textpassword, saltRounds);
			const theuser = {
				username: name,
				password: hashP,
				first_name: firstname,
				last_name: lastname
			};
			await user.insertOne(theuser);
			console.log("user " + name + " successfully created");
			var auth = index.getCollection("auth");
			const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || "ERR";
			const u_a = request.headers['user-agent'];
			var hashed = await bcrypt.hash(ipAddress + hashP + u_a, saltRounds);
			const authQuery = {
				ip: ipAdress,
				user_agent: u_a,
				hash: hashed,
				user_id: theuser._id
			};
			var auth = await auth;
			await auth.insertOne(authQuery);
			return 0;
		} else {
			return 1;
		};
	} catch(err) {
		return -1;
		throw err;
	}
};

async function checkCookie(request) {
	try {
		var db = await index.getCollection("session");
		var c = parseCookies(request);
		if ("cookie" in c) {
			const query = {
				cookie: cookie
			};
			var searchresult = await db.find(query).toArray();
			if (searchresult.length != 0) {
				if (cookie == searchresult[0]["cookie"]) {
					return searchresult[0]["user"];
				} else {
					return 1;
				};
			};
		} else {
			return 1;
		}
	} catch (err) {
	    return -1;
	    throw err;
	}
}

async function checkPassword(request, name, passwordtocheck) {
	try {
		var user = await index.getCollection("user");
		const query = {
			username: name
		};
		var searchresult = await user.find(query).toArray();
		if (searchresult.length != 0) {
			var result = await bcrypt.compare(passwordtocheck, searchresult[0]["password"]);
		};
		if (result) {
			return 0;
		  response.writeHead(200, {
		    'Set-Cookie': '=test'
		  });
		} else {
			return 1;
		};
	} catch(err) {
		return -1;
		throw err;
	}
};


exports.createUser = createUser;
exports.checkPassword = checkPassword;
