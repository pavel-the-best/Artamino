const user = require("./user.js");
const ObjectID = require("mongodb").ObjectId;
const index = require("./index.js");

async function createMessage(request, text) {
    try {
        const userInfo = await user.checkCookie(request);
        if (userInfo === 0) {
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
    } catch(err) {
        throw err;
    }
}

exports.createMessage = createMessage;
