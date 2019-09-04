const url = require("url");
const qs = require("querystring");
const path = require("path");
const user = require("./user.js");
const reader = require("./reader.js");
const chatter = require("./chat.js");
const error = require("./error.js");


function regr(request, response) {
  let data = "";
  request.addListener("data", function (chunk) {
    data += chunk;
  });
  request.addListener("end", async function () {
    try {
      const d = qs.parse(data);
      if ("username" in d && "password" in d && "firstName" in d && "lastName" in d && d["username"].trim() && d["password"].trim() && d["firstName"].trim() && d["lastName"].trim()) {
        let result = await user.createUser(request, d["username"], d["password"], d["firstName"], d["lastName"]);
        if (typeof result == "number") {
          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write(result.toString());
        } else {
          response.writeHead(200, {"Content-Type": "text/plain", "Set-Cookie": "auth=" + result});
          response.write("1");
        }
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("-1");
      }
      response.end();
    } catch (err) {
      error.writeError(500, response);
      console.error(err);
    }
  });
}

function logn(request, response) {
  let data = "";
  request.addListener("data", function (chunk) {
    data += chunk;
  });
  request.addListener("end", async function () {
    try {
      const d = qs.parse(data);
      if ("username" in d && "password" in d && d["username"].trim() && d["password"].trim()) {
        let result = await user.checkPassword(request, d["username"], d["password"]);
        if (result.toString().length > 2) {
          response.writeHead(200, {"Content-Type": "text/plain", "Set-Cookie": "auth=" + result.toString()});
          response.write("1");
        } else {
          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write(result.toString());
        }
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("-1");
      }
      response.end();
    } catch (err) {
      error.writeError(500, response);
      console.error(err);
    }
  });
}

async function logOut(request, response) {
  try {
    await user.logOut(request);
    const args = {"user": "Not logged in"};
    const data = await reader.read("./HTML/index.html", args);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function createMessage(request, response) {
  try {
    if (request.method === "GET") {
      const query = qs.parse(url.parse(request.url).query);
      if ("text" in query) {
        if (await chatter.createMessage(request, query["text"])) {
          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write("Done!");
          response.end();
        } else {
          error.writeError(401, response);
        }
      } else {
        error.writeError(400, response);
      }
    } else {
      error.writeError(400, response);
    }
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function getAllMessages(request, response) {
  try {
    const messages = await chatter.getAllMessages(request);
    if (messages[0]) {
      response.writeHead(200, {"Content-Type": "text/plain", "Cache-Control": "no-cache, no-store"});
      response.write(JSON.stringify(messages[1], '\n', '  '));
      response.end();
    } else {
      error.writeError(401, response);
    }
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function readContent(pathname, request, response) {
    try {
        if (pathname === "/") {
            pathname = "/index";
        }
        const HTMLRes = await reader.fileExists("./HTML" + pathname + ".html");
        if (HTMLRes) {
                const userInfo = await user.checkCookie(request);
                let args = {"user": "Not logged in"};
                if (userInfo) {
                    args = {"user": "Logged in as " + userInfo["username"], "user_id": userInfo["_id"]};
                }
                const data = await reader.read("./HTML" + pathname + ".html", args);
                response.writeHead(200, {"Content-Type": "text/html", "Cache-Control": "no-cache, no-store"});
                response.write(data);
                response.end();
        } else {
            const staticRes = await reader.fileExists("./static" + pathname);
            if (staticRes) {
                const data = await reader.read("./static" + pathname);
                let extname = path.extname(pathname).substring(1);
                if (extname === "js") {
                    extname = "javascript"
                }
                response.writeHead(200, { "Content-Type": "text/" + extname, "Cache-Control": "public, max-age=3600" });
                response.write(data);
                response.end();
            } else {
                await error.writeHTMLError(404, response);
            }
        }
    } catch(err) {
        error.writeError(500, response);
        console.error(err);
    }
}

exports.regr = regr;
exports.logn = logn;
exports.logOut = logOut;
exports.createMessage = createMessage;
exports.getAllMessages = getAllMessages;
exports.readContent = readContent;
