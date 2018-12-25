const fs = require("fs");

function start(response) {
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

function style(response) {
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

function register(response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Oh, this is not written now");
  response.end();
};

function bootstrapCSS(response) {
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

async function bootstrapJS(response) {
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

function bootstrapCSSMap(response) {
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

function Jquery(response) {
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

exports.start = start;
exports.style = style;
exports.register = register;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.Jquery = Jquery;
exports.bootstrapCSSMap = bootstrapCSSMap;
