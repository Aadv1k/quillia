import http from "node:http";
import { sendPublicFile } from "./common/utils";

import RouteSignup from "./routes/Signup"
import RouteLogin from "./routes/Login";
import RouteBooks from "./routes/Books";
import RouteIssue from "./routes/Issue";

export default http.createServer( async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url: string  = new URL(`https://foo.com${req.url}`).pathname;

  if (url === "/") {
    sendPublicFile(res, "index.html");
  } else if (url ==="/api/signup") {
    await RouteSignup(req, res);
  } else if (url ==="/api/login") {
    await RouteLogin(req, res);
  } else if (url.match(/^\/api\/books/)) {
    await RouteBooks(req, res);
  } else if (url.match(/^\/api\/issue/))  {
    await RouteIssue(req, res);
  } else {
    sendPublicFile(res, "index.html");
  }
  res.end();
})
