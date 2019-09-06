const user = require("./user.js");
const ObjectID = require("mongodb").ObjectId;
const index = require("./index.js");

async function createMessage(request, text) {
  try {
    const userInfo = await user.checkCookie(request);
    if (!userInfo) {
      return 0;
    }
    const message = await index.getCollection("message", "message");
    const now = new Date();
    const query = {
      text: text,
      user_id: ObjectID(userInfo._id),
      created: now.getTime()
    };
    await message.insertOne(query);
    return 1;
  } catch (err) {
    throw err;
  }
}

async function getAllMessages(request) {
  try {
    const userInfo = await user.checkCookie(request);
    if (!userInfo) {
      return [0, []];
    }
    let message = index.getCollection("message", "message");
    const authUser = await index.getCollection("auth", "user");
    const userList = await authUser.find().toArray();
    const userDict = {};
    for (let i in userList) {
      userDict[userList[i]["_id"]] = {
        _id: userList[i]["_id"],
        username: userList[i]["username"],
        firstName: userList[i]["first_name"],
        lastName: userList[i]["last_name"]
      };
    }
    message = await message;
    const messages = await message.find().toArray();
    return [1, parseMessages(messages, userDict)];
  } catch(err) {
    throw err;
  }
}

async function getMessages(request, lastTime) {
  try {
    const userInfo = await user.checkCookie(request);
    if (!userInfo) {
      return [0, []];
    }
    let message = index.getCollection("message", "message");
    const authUser = await index.getCollection("auth", "user");
    const userList = await authUser.find().toArray();
    const userDict = {};
    for (let i in userList) {
      userDict[userList[i]["_id"]] = {
        _id: userList[i]["_id"],
        username: userList[i]["username"],
        firstName: userList[i]["first_name"],
        lastName: userList[i]["last_name"]
      };
    }
    message = await message;
    const messages = await message.find().toArray();
    return [1, parseMessages(messages, userDict, lastTime)];
  } catch(err) {
    throw err;
  }
}

function parseMessages(messages, userDict, lastTime = 0) {
  try {
    let newMessages = [];
    for (let i in messages) {
      if (ObjectID(messages[i]["_id"]).getTimestamp().getTime() > lastTime) {
        newMessages.push({
          text: messages[i]["text"],
          user: userDict[messages[i]["user_id"]],
          created: messages[i]["created"]
        });
      }
    }
    return newMessages;
  } catch(err) {
    throw err;
  }
}

exports.createMessage = createMessage;
exports.getAllMessages = getAllMessages;
exports.getMessages = getMessages;
