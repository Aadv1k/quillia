import BookModel from "../models/BookModel";
import Bucket from "../models/Bucket";
import Token from "../lib/GenerateToken";
import { ERROR, MAX_EPUB_SIZE_MB } from "../common/const";
import { TokStatus, Book } from "../common/types";
import { sendJsonResponse, parseSimplePostData, md5 } from "../common/utils";

import filetype from "file-type-cjs";

import fs from "node:fs";
import EPub from "epub";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

import { v4 as uuid } from "uuid";

import http from "node:http";

const BUCKET = new Bucket();

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const BOOK_DB = new BookModel();
  await BUCKET.init();

  const authorization = req.headers?.authorization;
  const authToken = authorization?.split(" ")?.pop();

  if (!authorization || !authToken) {
    sendJsonResponse(res, ERROR.unauthorized, 401);
    return;
  }

  const token = new Token();
  const tokenStatus: TokStatus = token.verify(authToken);
  const parsedAuthToken: any = token.UNSAFE_parse(authToken);

  if (
    tokenStatus === TokStatus.INVALID ||
    tokenStatus === TokStatus.INVALID_SIG
  ) {
    sendJsonResponse(res, ERROR.unauthorized, 401);
    return;
  }

  if (req.method === "GET") {
    try {
      let userBooks = await BOOK_DB.getBooks(parsedAuthToken.id);
      sendJsonResponse(res, userBooks, 200);
    } catch (error) {
      console.error(error);
      sendJsonResponse(res, ERROR.internalErr);
    } finally {
      await BOOK_DB.close();
      return;
    }
  } else if (req.method === "POST") {
    await BOOK_DB.init();

    if (req.headers?.["content-type"] != "application/epub+zip") {
      sendJsonResponse(res, ERROR.invalidMimeForResource, 415);
      return;
    }

    let epubBuffer = await parseSimplePostData(req);
    let epubSizeInMB = Math.ceil(epubBuffer.length / 1e6);
    let bufferMime = await filetype.fromBuffer(epubBuffer);

    if (bufferMime.mime != "application/epub+zip") {
      sendJsonResponse(res, ERROR.invalidMimeForResource, 415);
      return;
    }

    if (epubSizeInMB > MAX_EPUB_SIZE_MB) {
      sendJsonResponse(res, ERROR.fileTooLarge, 400);
      return;
    }

    let randomString = crypto.randomBytes(16).toString("hex");
    const tempEpubFilePath = path.join(os.tmpdir(), `tmp-${randomString}.epub`);
    fs.writeFileSync(tempEpubFilePath, epubBuffer);

    const epub: EPub = await new Promise((resolve, reject) => {
      const epub = new EPub(tempEpubFilePath);
      epub.on("end", () => resolve(epub));
      epub.on("error", reject);
      epub.parse();
    });

    const epubCoverBuffer: [Buffer, string] = await new Promise((resolve, reject) => {
      epub.getImage("cover.jpg", (error, data, mime) => {
        if (error || mime !== "image/jpeg") reject(null);
        resolve([data, mime]);
      });
    });

    let epubSignature = md5(epubBuffer.toString("hex"));

    let foundBook = await BOOK_DB.getBook("", epubSignature);
    if (foundBook) {
      sendJsonResponse(
        res,
        {
          ...ERROR.resourceExists,
          data: {
            id: foundBook.id,
          },
        },
        409
      );
      return;
    }

    let epubFilePermalink = await BUCKET.pushBufferWithName( epubBuffer, `${epubSignature}.epub`)
    let epubID = uuid();

    let epubCoverPermalink = null;

    if (epubCoverBuffer) { 
      epubCoverPermalink = await BUCKET.pushBufferWithName(epubCoverBuffer[0], `${epubSignature}.${epubCoverBuffer[1].split('/').pop()}`) 
    }

    let epubEntry: Book = { 
      id: epubID,
      userid: parsedAuthToken.id,
      title:  epub.metadata?.title ?? epubID.split('-').pop(),
      author: epub.metadata?.creator ?? parsedAuthToken.email,
      path: epubFilePermalink,
      signature: epubSignature,
      cover: epubCoverPermalink
    }

    const pushed = await BOOK_DB.pushBook(epubEntry);

    if (!pushed) {
      sendJsonResponse(res, ERROR.internalErr, 500);
      return;
    }

    sendJsonResponse(
      res,
      {
        error: null,
        message: `successfully published a book of id ${epubEntry.id}`,
        data: {
          id: epubEntry.id,
        },
      },
      201
    );

    await BOOK_DB.close();
    return;
  }
}