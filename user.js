const index = require("./index.js");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

function parseCookies (request) {
    let cookies = request.headers.cookie;
    if (cookies === undefined) {
    	return undefined;
	}
	cookies = cookies.split(';');
	let d = {};
	let cur = [];
	for (let i in cookies) {
		cur = cookies[i].split('=');
		d[cur[0].trim()] = cur[1].trim();
	}
	return d;
}

const saltRounds = 11;

async function createUser(request, name, textpassword, firstname, lastname) {
	try {
		const user = await index.getCollection("auth", "user");
		const query = {
			username: name
		};
		const tryUser = await user.find(query).toArray();
		if (tryUser.length === 0) {
			const hashP = await bcrypt.hash(textpassword, saltRounds);
			const theUser = {
				username: name,
				password: hashP,
				first_name: firstname,
				last_name: lastname
			};
			await user.insertOne(theUser);
			console.log("user " + name + " successfully created");
			let auth = index.getCollection("auth","auth");
			const u_a = request.headers['user-agent'];
			const authQuery = {
				user_agent: u_a,
				user_id: theUser._id
			};
			auth = await auth;
			const res = await auth.insertOne(authQuery);
			return res.insertedId;
		} else {
			return 0;
		}
	} catch(err) {
		return -1;
	}
}

async function checkCookie(request) {
	try {
		const auth = await index.getCollection("auth", "auth");
		const c = parseCookies(request);
		if (c === undefined)
			return 0;
		if ("auth" in c) {
			const query = {
				_id: ObjectId(c["auth"]),
				user_agent: request.headers['user-agent']
			};
			const searchresult = await auth.find(query).toArray();
			if (searchresult.length !== 0) {
				const user = await index.getCollection("auth", "user");
				const userQuery = {
					_id: ObjectId(searchresult[0]["user_id"])
				};
				const resultUser = await user.find(userQuery).toArray();
				if (resultUser.length > 0) {
					return resultUser[0];
				} else {
					return 0;
				}
			} else {
			    return 0;
			}
		} else {
			return 0;
		}
	} catch (err) {
		throw err;
	}
}

async function logOut(request) {
	try {
		const result = await checkCookie(request);
		if (result !== 0) {
			const auth = await index.getCollection("auth", "auth");
			const c = parseCookies(request);
			const query = {
				_id: ObjectId(c["auth"])
			};
			await auth.deleteOne(query);
		}
	} catch(err) {
		throw err;
	}
}

async function checkPassword(request, name, passwordtocheck) {
	try {
	    const res1 = await checkCookie(request);
	    if (res1 === 0) {
		    const user = await index.getCollection("auth","user");
		    const query = {
			    username: name
		    };
		    const searchResult = await user.find(query).toArray();
		    let result = false;
		    if (searchResult.length !== 0) {
		    	result = await bcrypt.compare(passwordtocheck, searchResult[0]["password"]);
			}
			if (result) {
		        const u_a = request.headers['user-agent'];
		        const query = {
		            user_id: searchResult[0]["_id"],
		            user_agent: u_a
		        };
		        const auth = await index.getCollection("auth", "auth");
		        const res = await auth.insertOne(query);
		    	return res.insertedId;
		    } else {
		    	return 0;
		    }
		} else {
		    return 1;
		}
	} catch(err) {
		throw err;
	}
}

exports.createUser = createUser;
exports.checkPassword = checkPassword;
exports.checkCookie = checkCookie;
exports.logOut = logOut;
