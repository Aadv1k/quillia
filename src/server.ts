import http from "node:http";
import { sendPublicFile } from "./common/utils";

import RouteSignup from "./routes/Signup"
import RouteLogin from "./routes/Login";
import RouteBooks from "./routes/Books";
import RouteIssue from "./routes/Issue";

export default http.createServer( async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url: string  = req.url;

  if (url === "/") {
    sendPublicFile(res, "index.html");
  } else if (url.startsWith("/api/signup")) {
    await RouteSignup(req, res);
  } else if (url.startsWith("/api/login")) {
    await RouteLogin(req, res);
  } else if (url.startsWith("/api/books")) {
    await RouteBooks(req, res);
  } else if (url.startsWith("/api/issue"))  {
    await RouteIssue(req, res);
  }
  res.end();
})
