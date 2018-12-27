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

function Jquery(request, response) {
  fs.readFile("./static/jquery-3.3.1.min.js", function(err, data) {
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
    var result = await user.createUser(d["username"], d["password"], d["firstname"], d["lastname"]);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(result.toString());
    response.end();
  })
}

exports.start = start;
exports.style = style;
exports.register = register;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.Jquery = Jquery;
exports.bootstrapCSSMap = bootstrapCSSMap;
exports.regr = regr;
