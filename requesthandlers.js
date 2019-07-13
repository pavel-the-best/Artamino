const url = require("url");
const qs = require("querystring");
const user = require("./user.js");
const reader = require("./reader.js");
const chat = require("./chat.js");
const error = require("./error.js");

async function start(request, response) {
  try {
    const userInfo = await user.checkCookie(request);
    let args = {"user": "Not logged in"};
    if (userInfo) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/index.html", args);
    response.writeHead(200, {"Content-Type": "text/html", "Cache-Control": "no-cache, no-store"});
    response.write(data);
    response.end();
  } catch (err) {
    await error.writeHTMLError(500, response);
    console.error(err);
  }
}

async function style(request, response) {
  try {
    const data = await reader.read("./static/style.css");
    response.writeHead(200, {"Content-Type": "text/css", "Cache-Control": "public, max-age=31536000"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function register(request, response) {
  try {
    const userInfo = await user.checkCookie(request);
    let args = {"user": "Not logged in"};
    if (userInfo) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/regr.html", args);
    response.writeHead(200, {"Content-Type": "text/html", "Cache-Control": "no-cache, no-store"});
    response.write(data);
    response.end();
  } catch (err) {
    await error.writeHTMLError(500, response);
    console.error(err);
  }
}

async function login(request, response) {
  try {
    const userInfo = await user.checkCookie(request);
    let args = {"user": "Not logged in"};
    if (userInfo) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/logn.html", args);
    response.writeHead(200, {"Content-Type": "text/html", "Cache-Control": "no-cache, no-store"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function bootstrapCSS(request, response) {
  try {
    const data = await reader.read("./static/bootstrap.min.css");
    response.writeHead(200, {"Content-Type": "text/css", "Cache-Control": "public, max-age=31536000"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function bootstrapJS(request, response) {
  try {
    const data = await reader.read("./static/bootstrap.min.js");
    response.writeHead(200, {"Content-Type": "text/js", "Cache-Control": "public, max-age=31536000"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

async function Jquery(request, response) {
  try {
    const data = await reader.read("./static/jquery-3.4.1.min.js");
    response.writeHead(200, {"Content-Type": "text/js", "Cache-Control": "public, max-age=31536000"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    console.error(err);
  }
}

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
        if (await chat.createMessage(request, query["text"])) {
          response.writeHead(200, "Content-Type: text/plain");
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
    const messages = await chat.getAllMessages(request);
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

exports.start = start;
exports.style = style;
exports.register = register;
exports.login = login;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.Jquery = Jquery;
exports.regr = regr;
exports.logn = logn;
exports.logOut = logOut;
exports.createMessage = createMessage;
exports.getAllMessages = getAllMessages;
