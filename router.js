const requestHandlers = require("./requesthandlers");

async function route(pathname, handle, request, response) {
  if (typeof handle[pathname] === "function") {
    handle[pathname](request, response);
  } else {
    if (process.env.DEBUG) console.log("No request handler found for " + pathname + ", trying ultra reader.");
    requestHandlers.readContent(pathname, request, response);
  }
}

exports.route = route;
