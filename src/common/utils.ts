import { ServerResponse } from "node:http";
import { ErrorBlob, MIME } from "./const";
import {  existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function sendJsonResponse(res: ServerResponse, error: ErrorBlob) {
  res.writeHead(error.status, {
    "Content-type": "application/json",
  })
  res.write(JSON.stringify(error), "utf-8");
}

export function sendHtmlResponse(res: ServerResponse, html: string, status: number = 200) {
  res.writeHead(status, {
    "Content-type": "text/html",
  })
  res.write(html, "utf-8");
}

export function sendPublicFile(res: ServerResponse, filepath: string) {
  let resourcePath = path.resolve(__dirname, "../../public", filepath)
  let notFoundPath  = path.resolve(__dirname,  "../../public", "404.html");

  if (!existsSync(resourcePath)) {
    const html = readFileSync(notFoundPath, "utf-8");
    sendHtmlResponse(res, html, 404);
    return;
  }

  let ext = filepath.split('.').pop();
  res.writeHead(200, { "Content-type": MIME[ext] });
  res.write(readFileSync(resourcePath, "utf-8"))
}
