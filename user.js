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
			const authQuery = {
				ip: ipAddress,
				user_agent: u_a,
				user_id: theuser._id
			};
			var auth = await auth;
			await auth.insertOne(authQuery);
			return user_id;
		} else {
			return 1;
		};
	} catch(err) {
		throw err;
		return -1;
	}
};

async function checkCookie(request) {
	try {
		var db = await index.getCollection("auth");
		var c = parseCookies(request);
		if ("auth" in c.keys) {
			const query = {
				user_id: c["auth"],
				user_agent = request.headers['user-agent']
			};
			const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || "ERR";
			var searchresult = await db.find(query).toArray();
			if (searchresult.length != 0) {
				return c["auth"]
			} else {
			    return 0;
			}
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
	    if (checkCookie(request) == 0 || checkCookie(request) == -1) {
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
		    } else {
		    	return 1;
		    };
		} else {
		    return 0;
		}
	} catch(err) {
		return -1;
		throw err;
	}
};


exports.createUser = createUser;
exports.checkPassword = checkPassword;
