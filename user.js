const index = require("./index.js");
const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectId;

function parseCookies(request) {
  let cookies = request.headers.cookie;
  if (!cookies) {
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

async function createUser(request, name, textPassword, firstName, lastName) {
  try {
    const user = await index.getCollection("auth", "user");
    const query = {
      username: name
    };
    const tryUser = await user.find(query).toArray();
    if (tryUser.length === 0) {
      const hashP = await bcrypt.hash(textPassword, saltRounds);
      const theUser = {
        username: name,
        password: hashP,
        first_name: firstName,
        last_name: lastName
      };
      await user.insertOne(theUser);
      console.log("user " + name + " successfully created");
      let auth = index.getCollection("auth", "auth");
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
  } catch (err) {
    throw err;
  }
}

async function getUserInfo(userID) {
  try {
    const user = await index.getCollection("auth", "user");
    const userQuery = {
      _id: ObjectID(userID)
    };
    return await user.findOne(userQuery);
  } catch(err) {
    throw err;
  }
}

async function checkCookie(request) {
  try {
    const c = parseCookies(request);
    if (c && "auth" in c && (c["auth"].length === 12 || c["auth"].length === 24)) {
      const query = {
        _id: ObjectID(c["auth"]),
        user_agent: request.headers['user-agent']
      };
      const auth = await index.getCollection("auth", "auth");
      const searchResult = await auth.find(query).toArray();
      if (searchResult.length !== 0) {
        return await getUserInfo(searchResult[0]["user_id"]);
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
    if (result) {
      const auth = await index.getCollection("auth", "auth");
      const c = parseCookies(request);
      const query = {
        _id: ObjectID(c["auth"])
      };
      await auth.deleteOne(query);
    }
  } catch (err) {
    throw err;
  }
}

async function checkPassword(request, name, passwordToCheck) {
  try {
    const res1 = await checkCookie(request);
    if (!res1) {
      const user = await index.getCollection("auth", "user");
      const query = {
        username: name
      };
      const searchResult = await user.find(query).toArray();
      let result = false;
      if (searchResult.length !== 0) {
        result = await bcrypt.compare(passwordToCheck, searchResult[0]["password"]);
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
  } catch (err) {
    throw err;
  }
}

exports.createUser = createUser;
exports.checkPassword = checkPassword;
exports.checkCookie = checkCookie;
exports.logOut = logOut;
exports.getUserInfo = getUserInfo;
