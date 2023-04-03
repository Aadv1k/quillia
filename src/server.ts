import http from "node:http";
import { sendPublicFile } from "./common/utils";
import RouteLogin from "./routes/Login"

export default http.createServer( async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url: string  = req.url;
  if (url === "/") {
    sendPublicFile(res, "index.html");
  } else if (url.startsWith("/api/login")) {
    await RouteLogin(req, res);
  }
  res.end();
})
