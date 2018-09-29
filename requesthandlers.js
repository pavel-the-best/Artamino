var fs = require('fs');

function start(response) {
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

function style(response) {
  fs.readFile("./style.css", function(err, data) {
    if (err){
      throw err;
      console.log(error);
    }
    else {
      response.writeHead(200, {"Content-Type": "text/css"});
      response.write(data.toString('utf-8'));
      response.end();
    }
  });
}

exports.start = start;
exports.style = style;
