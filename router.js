const error = require("./error.js");

async function route(pathname, handle, request, response) {
	if (typeof handle[pathname] === "function") {
		handle[pathname](request, response);
  } else {
    console.log("No request handler found for " + pathname);
    await error.writeHTMLError(404, response);
  }
}

exports.route = route;
