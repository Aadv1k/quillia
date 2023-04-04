import { ServerResponse } from "node:http";
import {  existsSync, readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { MIME } from "./const";

export function sendJsonResponse(res: ServerResponse, error: object, status: number = 200) {
  res.writeHead(status, {
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

export function md5(data: string): string {
  return crypto
    .createHash("md5")
    .update(data)
    .digest("hex");
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
