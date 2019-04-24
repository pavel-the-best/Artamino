const fs = require("fs");
const user = require("./user.js")

function start(request, response) {
  fs.readFile("./HTML/index.html", function(err, data) {
    if (err){
      throw err;
      console.log(error);
    }
    else {
      response.writeHead(200, {"Content-Type": "text/html", "Set-Cookie": "user=abracadabra"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

function style(request, response) {
  fs.readFile("./static/style.css", function(err, data) {
    if (err){
      throw err;
      console.log(error);
    }
    else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

function register(request, response) {
  fs.readFile("./HTML/regr.html", function(err, data) {
    if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

function login(request, response) {
  fs.readFile("./HTML/logn.html", function(err, data) {
    if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

function bootstrapCSS(request, response) {
  fs.readFile("./static/css/bootstrap.css", function(err, data) {
	if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

async function bootstrapJS(request, response) {
  fs.readFile("./static/js/bootstrap.js", function(err, data) {
  if (err) {
	throw err;
    console.log(err);
  } else {
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(data.toString("utf-8"));
    response.end();
  };
  });
};

function bootstrapCSSMap(request, response) {
  fs.readFile("./static/css/bootstrap.css.map", function(err, data) {
    if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
};

function bootstrapJSMap(request, response) {
  fs.readFile("./static/js/bootstrap.js.map", function(err, data) {
    if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString("utf-8"));
      response.end();
    }
  });
}

function Jquery(request, response) {
  fs.readFile("./static/jquery-3.3.1.min.js", function(err, data) {
    if (err) {
      throw err;
      console.log(err);
    } else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString("utf-8"));
      response.end();
    };
  });
};

function regr(request, response) {
  data = "";
  request.addListener("data", function(chunk) {
    data += chunk;
  });
  request.addListener("end", async function() {
    data = data.split("&");
    d = {};
    for (i in data) {
      b = data[i].split("=");
      d[b[0]] = b[1];
    };
    if ("username" in d && "password" in d && "firstname" in d && "lastname" in d) {
      var result = await user.createUser(request, d["username"], d["password"], d["firstname"], d["lastname"]);
      result = result.toString()
      if (result.length > 2) {
        response.writeHead(200, {"Content-Type": "text/plain", "Set-Cookie": "auth=" + result});
        response.write("0")
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"})
        response.write(result)
      }
    } else {
      response.writeHead(500, {"Content-Type": "text/plain"})
      response.write("-1");
    };
    response.end();
  });
}

function logn(request, response) {
  data = "";
  request.addListener("data", function(chunk) {
    data += chunk;
  });
  request.addListener("end", async function() {
    data = data.split("&");
    d = {};
    for (i in data) {
      b = data[i].split("=");
      d[b[0]] = b[1];
    };
    if ("username" in d && "password" in d) {
      var result = await user.checkPassword(request, d["username"], d["password"]);
      if (result.toString().length > 2) {
        response.writeHead(200, {"Content-Type": "text/plain", "Set-Cookie": "auth=" + result.toString()});
        response.write("0");
      } else if (result == 0) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("0");
      } else if (result == -1) {
        response.writeHead(500, {"Content-Type": "text/plain"})
        response.write("-1")
      } else if (result == 1) {
        response.writeHead(200, {"Content-Type": "text/plain"})
        response.write("1")
      }
    } else {
      response.write("1");
    };
    response.end();
  });
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
