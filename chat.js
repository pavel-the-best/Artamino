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
    const date = new Date();
    const milliseconds = date.getTime();
    const query = {
      text: text,
      user_id: ObjectID(userInfo._id),
      created: milliseconds
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
    const message = await index.getCollection("message", "message");
    const messages = await message.find().toArray();
    return await [1, await parseMessages(messages)];
  } catch(err) {
    throw err;
  }
}

async function parseMessages(messages) {
  try {
    for (let i in messages) {
      const userInfo = await user.getUserInfo(messages[i]["user_id"]);
      if (userInfo) delete userInfo.password;
      messages[i] = {
        text: messages[i]["text"],
        user: userInfo,
        created: messages[i]["created"]
      };
    }
    return Promise.resolve(messages);
  } catch(err) {
    throw err;
  }
}

exports.createMessage = createMessage;
exports.getAllMessages = getAllMessages;
