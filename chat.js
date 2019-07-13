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
    const query = {
      text: text,
      user_id: ObjectID(userInfo._id),
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
      delete userList[i].password;
      userDict[userList[i]["_id"]] = userList[i];
    }
    message = await message;
    const messages = await message.find().toArray();
    return [1, parseMessages(messages, userDict)];
  } catch(err) {
    throw err;
  }
}

function parseMessages(messages, userDict) {
  try {
    for (let i in messages) {
      messages[i] = {
        text: messages[i]["text"],
        user: userDict[messages[i]["user_id"]],
        created: ObjectID(messages[i]["_id"]).getTimestamp().getTime()
      };
    }
    return messages;
  } catch(err) {
    throw err;
  }
}

exports.createMessage = createMessage;
exports.getAllMessages = getAllMessages;
