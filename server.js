const http = require("http2");
const url = require("url");
const router = require("./router.js");

function startServer(route, handle, host, port) {
  async function onRequest(request, response) {
    const pathname = url.parse(request.url).pathname;
    if (process.env.DEBUG) {
      const d = new Date();
      const now = d.toLocaleString("ru");
      console.log(now + " " + request.method + " Request for http://" + host + ":" + port + pathname + " recieved");
    }
    await router.route(pathname, handle, request, response);
  }

  const server = http.createServer(onRequest);
  server.listen(port, host);
  console.log("Server started successfully. Listening requests on  " + host + ":" + port + ".");
}

exports.startServer = startServer;
