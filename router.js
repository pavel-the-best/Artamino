const fs = require("fs");

function route(pathname, handle, request, response) {
	if (typeof handle[pathname] === "function") {
    handle[pathname](request, response);
  } else {
    console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-type": "text/html"});
		fs.readFile("HTML/error.html", function(err, data) {
			if (err) {
				throw err;
				console.log(error);
			} else {
				response.write(data.toString("utf-8"));
				response.end();
			}
		});
  }
};

exports.route = route;
