var fs = require('fs');

function start(response) {
  console.log("Request handler 'start' was called.");
  fs.readFile("./index.html", function(err, data) {
    if (err){
      throw err;
      console.log(error);
    }
    else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data.toString('utf-8'));
      response.end();
    }
  });
}

function upload(response) {
  console.log("Request handler 'upload' was called.");
  fs.readFile("./index.html", function(err, data) {
    if (err){
      throw err;
      console.log(error);
    }
    else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data.toString('utf-8'));
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
