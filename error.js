const reader = require('./reader.js');

async function writeHTMLError(errorCode, response) {
  let errorNames = {
    404: "Not Found",
    500: "Internal Server Error",
  };
  let data = await reader.read("./HTML/error.html", {"code": errorCode, "name": errorNames[errorCode]});
  response.writeHead(errorCode, {"Content-Type": "text/html"});
  response.write(data);
  response.end();
}

function writeError(errorCode, response) {
  let errorNames = {
    404: "Not Found",
    500: "Internal Server Error",
  };
  response.writeHead(errorCode);
  response.write(errorCode + ' ' + errorNames[errorCode]);
  response.end();
}

exports.writeHTMLError = writeHTMLError;
exports.writeError = writeError;
