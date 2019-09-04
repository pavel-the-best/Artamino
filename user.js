const index = require("./index.js");
const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectId;

const saltRounds = 11;

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

async function createSession(request, userID) {
  let auth = index.getCollection("auth", "auth");
  const u_a = request.headers["user-agent"];
  const authQuery = {
    user_agent: u_a,
    user_id: userID
  };
  auth = await auth;
  const res = await auth.insertOne(authQuery);
  return res.insertedId;
}

async function createUser(request, name, textPassword, firstName, lastName) {
  try {
    const user = await index.getCollection("auth", "user");
    const query = {
      username_insensitive: name.toLowerCase()
    };
    const tryUser = await user.findOne(query);
    if (!tryUser) {
      const hashP = await bcrypt.hash(textPassword, saltRounds);
      const theUser = {
        username: name,
        username_insensitive: name.toLowerCase(),
        password: hashP,
        first_name: firstName,
        last_name: lastName
      };
      await user.insertOne(theUser);
      return await createSession(request, theUser._id);
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
        user_agent: request.headers["user-agent"],
      };
      const auth = await index.getCollection("auth", "auth");
      const searchResult = await auth.findOne(query);
      if (searchResult) {
        return await getUserInfo(searchResult["user_id"]);
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
    const loggedIn = checkCookie(request);
    const user = await index.getCollection("auth", "user");
    const query = {
      username: name
    };
    const searchResult = await user.findOne(query);
    let result = false;
    if (searchResult) {
      result = await bcrypt.compare(passwordToCheck, searchResult["password"]);
    }
    if (result) {
      if (await loggedIn) await logOut(request);
      return await createSession(request, ObjectID(searchResult["_id"]));
    } else {
      return 0;
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
