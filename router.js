function route(pathname, handle, response) {
	if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
    console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-type": "text/plain"});
		response.write("Error 404: Not Found")
		response.end();
  }
}

exports.route = route;
