import http, { IncomingMessage, ServerResponse } from "node:http";
import { sendPublicFile } from "./common/utils";
import RouteLogin from "./routes/Login"

export default http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url: string  = req.url;
  if (url === "/") {
    sendPublicFile(res, "index.html");
  } else if (url.startsWith("/api/login")) {
    RouteLogin(req, res);
  }

  res.end();
})
