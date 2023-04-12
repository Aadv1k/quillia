import crypto from "node:crypto";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { ServerResponse } from "node:http";

import {  existsSync, readFileSync } from "node:fs";
import * as nanoid from "nanoid";

import {IncomingForm, Fields, Files} from "formidable";

import { MIME } from "./const";

export function sendJsonResponse(res: ServerResponse, error: object, status: number = 200) {
  res.writeHead(status, {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'GET, POST, PUT, DELETE',
    "Access-Control-Allow-Headers": 'Content-type, authorization',
    "Access-Control-Allow-Credentials": "true",
  })

  res.write(JSON.stringify(error), "utf-8");
}

export function sendEpubResponse(res: ServerResponse, epubBuffer: Buffer, code?: number) {
  res.writeHead(code ?? 200, {
    "Content-type": "application/epub+zip"
  });
  res.write(epubBuffer);
}

export function uuid(): string {
  const nid = nanoid.customAlphabet("1234567890abcdef", 10);
  let id = nid();
  return id;
}

export async function getBufferFromRawURL(resourceUrl: string): Promise<Buffer | null> {
  let url = new URL(resourceUrl);

  try {
    let buffArr: Buffer[] = await new Promise((resolve, reject) => {
      let func = url.protocol === "https:" ? https : http;
      func.get(url, (res) => {
        let data: Buffer[] = [];

        res.on("data", (d: Buffer) => data.push(d))
        res.on("error", reject)
        res.on("end", () => resolve(data))
      })
    })

    let buffer = Buffer.concat(buffArr);
    return buffer;
  } catch (err) {
    console.error(err);
    return null;
  }
} 
 
export function sendHtmlResponse(res: ServerResponse, html: string, status: number = 200) {
  res.writeHead(status, {
    "Content-type": "text/html",
  })
  res.write(html, "utf-8");
}

export function parsePostData(req: http.IncomingMessage): Promise<Array<object>> {
  let form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields: Fields, files: Files) => {
      if (error) reject(error);
      resolve([fields, files]);
    })
  })
}

export function parseSimplePostData(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let data: Buffer[] = [];
    req.on("data", (chunk: Buffer) => data.push(chunk))
    req.on("end", () => { 
      const buf = Buffer.concat(data);
      resolve(buf);
    });
    req.on("error", reject);
  })
}

export function md5(data: string): string {
  return crypto
    .createHash("md5")
    .update(data)
    .digest("hex");
}

export function sendPublicFile(res: ServerResponse, filepath: string) {
  let resourcePath = path.join(__dirname, "../../public", filepath)

  if (!existsSync(resourcePath)) {
    // we hope to handle the 404 state on the frontend
    resourcePath = path.join(__dirname, "../../public", "index.html")
  }

  let ext = resourcePath.split('.').pop();
  res.writeHead(200, { "Content-type": MIME[ext] });
  res.write(readFileSync(resourcePath, "utf-8"))
}
