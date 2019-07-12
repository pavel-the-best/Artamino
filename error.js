const reader = require('./reader.js');

let errorNames = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

async function writeHTMLError(errorCode, response) {
  let data = await reader.read("./HTML/error.html", {"code": errorCode, "name": errorNames[errorCode]});
  response.writeHead(errorCode, {"Content-Type": "text/html"});
  response.write(data);
  response.end();
}

function writeError(errorCode, response) {
  response.writeHead(errorCode);
  response.write(errorCode + ' ' + errorNames[errorCode]);
  response.end();
}

exports.writeHTMLError = writeHTMLError;
exports.writeError = writeError;
