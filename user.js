const index = require("./index.js")
const bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;

function parseCookies (request) {
    cookies = request.headers.cookie;
    cookies = cookies.split(';');
    d = {};
    for (i in cookies) {
      cur = cookies[i].split('=');
      d[cur[0].trim()] = cur[1].trim();
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
			const u_a = request.headers['user-agent'];
			const authQuery = {
				user_agent: u_a,
				user_id: theuser._id
			};
			var auth = await auth;
			await auth.insertOne(authQuery);
			return theuser._id;
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
		if ("auth" in c) {
			const query = {
				user_id: ObjectId(c["auth"]),
				user_agent: request.headers['user-agent']
			};
			var searchresult = await db.find(query).toArray();
			if (searchresult.length != 0) {
				return c["auth"];
			} else {
			    return 0;
			}
		} else {
			return 0;
		}
	} catch (err) {
	    throw err;
	    return -1;
	}
}

async function checkPassword(request, name, passwordtocheck) {
	try {
	    var res1 = await checkCookie(request);
	    res1 = res1.toString();
	    if (res1.length < 3) {
		    var user = await index.getCollection("user");
		    const query = {
			    username: name
		    };
		    var searchresult = await user.find(query).toArray();
		    if (searchresult.length != 0) {
		    	var result = await bcrypt.compare(passwordtocheck, searchresult[0]["password"]);
		    };
		    if (result) {
		        const u_a = request.headers['user-agent'];
		        const query = {
		            user_id: searchresult[0]["_id"],
		            user_agent: u_a
		        };
		        var auth = await index.getCollection("auth");
		        await auth.insertOne(query);
		    	return 0;
		    } else {
		    	return 1;
		    };
		} else {
		    return 0;
		}
	} catch(err) {
		throw err;
		return -1;
	}
};


exports.createUser = createUser;
exports.checkPassword = checkPassword;
