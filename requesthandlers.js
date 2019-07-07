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
    if (userInfo !== 0) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/index.html", args);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  } catch (err) {
    await error.writeHTMLError(500, response);
    throw err;
  }
}

async function style(request, response) {
  try {
    const data = await reader.read("./static/style.css");
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function register(request, response) {
  try {
    const userInfo = await user.checkCookie(request);
    let args = {"user": "Not logged in"};
    if (userInfo !== 0) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/regr.html", args);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  } catch (err) {
    await error.writeHTMLError(500, response);
    throw err;
  }
}

async function login(request, response) {
  try {
    const userInfo = await user.checkCookie(request);
    let args = {"user": "Not logged in"};
    if (userInfo !== 0) {
      args = {"user": "Logged in as " + userInfo["username"]};
    }
    const data = await reader.read("./HTML/logn.html", args);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function bootstrapCSS(request, response) {
  try {
    const data = await reader.read("./static/css/bootstrap.css");
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function bootstrapJS(request, response) {
  try {
    const data = await reader.read("./static/js/bootstrap.js");
    response.writeHead(200, {"Content-Type": "text/js"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function bootstrapCSSMap(request, response) {
  try {
    const data = await reader.read("./static/css/bootstrap.css.map");
    response.writeHead(200);
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function bootstrapJSMap(request, response) {
  try {
    const data = await reader.read("./static/js/bootstrap.js.map");
    response.writeHead(200);
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function Jquery(request, response) {
  try {
    const data = await reader.read("./static/jquery-3.3.1.min.js");
    response.writeHead(200, {"Content-Type": "text/js"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

function regr(request, response) {
  let data = "";
  request.addListener("data", function (chunk) {
    data += chunk;
  });
  request.addListener("end", async function () {
    try {
      console.log(data);
      const d = qs.parse(data);
      if ("username" in d && "password" in d && "firstName" in d && "lastName" in d && d["username"].trim() && d["password"].trim() && d["firstName"].trim() && d["lastName"].trim()) {
        let result = await user.createUser(request, d["username"], d["password"], d["firstName"], d["lastName"]);
        result = result.toString();
        if (result.length > 2) {
          response.writeHead(200, {"Content-Type": "text/plain", "Set-Cookie": "auth=" + result});
          response.write("1")
        } else {
          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write(result);
        }
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("-1");
      }
      response.end();
    } catch (err) {
      error.writeError(500, response);
      throw err;
    }
  })
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
      throw err;
    }
  });
}

async function logOut(request, response) {
  try {
    await user.logOut(request);
    let args = {"user": "Not logged in"};
    const data = await reader.read("./HTML/index.html", args);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

async function createMessage(request, response) {
  try {
    let query = url.parse(request.url).query;
    let dict = {};
    query = query.split('&');
    for (let i in query) {
      let x = query[i].split('=');
      dict[x[0]] = x[1];
    }
    if ("text" in dict) {
      await chat.createMessage(request, dict["text"]);
      response.writeHead(200);
      response.write("Done!");
      response.end();
    } else {
      response.writeHead(400);
      response.write("400 Bad Request");
      response.end();
    }
  } catch (err) {
    error.writeError(500, response);
    throw err;
  }
}

exports.start = start;
exports.style = style;
exports.register = register;
exports.login = login;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.Jquery = Jquery;
exports.bootstrapCSSMap = bootstrapCSSMap;
exports.bootstrapJSMap = bootstrapJSMap;
exports.regr = regr;
exports.logn = logn;
exports.logOut = logOut;
exports.createMessage = createMessage;
