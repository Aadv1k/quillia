import IssueModel from "../models/IssueModel";
import BookModel from "../models/BookModel";
import UserModel from "../models/UserModel";

import Token from "../lib/GenerateToken";
import { ERROR } from "../common/const";
import { TokStatus, Issue } from "../common/types";
import {
  sendJsonResponse,
  sendEpubResponse,
  parseSimplePostData,
  uuid,
  getBufferFromRawURL,
} from "../common/utils";

import http from "node:http";
import https from "node:https";

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const ISSUE_DB = new IssueModel();
  const BOOK_DB = new BookModel();
  const USER_DB = new UserModel();
  const authorization = req.headers?.authorization;
  const authToken = authorization?.split(" ")?.pop()?.trim();

  try {
    if (req.method === "OPTIONS") {
      sendJsonResponse(res, {}, 200);
      return;
    }

    if (!authorization || !authToken) {
      sendJsonResponse(res, ERROR.unauthorized, 401);
      return;
    }

    const token = new Token();
    const tokenStatus: TokStatus = token.verify(authToken);

    if (
      tokenStatus === TokStatus.INVALID ||
      tokenStatus === TokStatus.INVALID_SIG
    ) {
      sendJsonResponse(res, ERROR.unauthorized, 401);
      return;
    }

    await ISSUE_DB.init();
    await BOOK_DB.init();
    await USER_DB.init();

    const parsedAuthToken: any = token.UNSAFE_parse(authToken);
    if (req.method === "GET") {
      let URLParams = req.url.split("/").slice(3);
      let requestedBook = URLParams?.[0];

      if (requestedBook) {
        let targetBook = await BOOK_DB.getBook(requestedBook);
        if (!targetBook) {
          sendJsonResponse(res, ERROR.resourceNotExists, 404);
          return;
        }

        let epubResourcePath = targetBook.path;
        const response: Array<Buffer> = await new Promise((resolve, reject) => {
          https.get(epubResourcePath, (res) => {
            let data: Array<Buffer> = [];
            res.on("data", (d: Buffer) => data.push(d));
            res.on("end", () => resolve(data));
            res.on("error", (error) => reject(error));
          });
        });

        let epubBuffer = Buffer.concat(response);
        sendEpubResponse(res, epubBuffer);
        return;
      } else {
        let userIssues = await ISSUE_DB.getIssues(parsedAuthToken.id);
        if (!userIssues) {
          sendJsonResponse(res, ERROR.resourceNotExists, 404);
        } else {
          sendJsonResponse(res, userIssues, 200);
        }
      }
    } else if (req.method === "POST") {
      if (req.headers?.["content-type"] != "application/json") {
        sendJsonResponse(res, ERROR.invalidMimeForResource, 415);
        return;
      }

      let issueData: Issue;

      try {
        let issuePostData = await parseSimplePostData(req);
        issueData = JSON.parse(issuePostData.toString());
      } catch (error) {
        console.error(error);
        sendJsonResponse(res, ERROR.badRequest, 400);
        return;
      }

      if (!issueData.lenderid || !issueData.bookid) {
        sendJsonResponse(res, ERROR.badRequest, 400);
        return;
      }

      let foundLender = await USER_DB.getUserByID(issueData.lenderid);
      let foundBook = await BOOK_DB.getBook(issueData.bookid);

      if (!foundLender || !foundBook) {
        sendJsonResponse(res, ERROR.resourceNotExists, 404);
        return;
      }
      let foundIssue = await ISSUE_DB.getIssue(
        foundLender.id,
        foundBook.id,
        parsedAuthToken.id
      );

      console.log(foundIssue);

      if (foundIssue) {
        sendJsonResponse(
          res,
          {
            ...ERROR.resourceExists,
            data: {
              id: foundIssue.id,
              bookid: foundIssue.bookid,
            },
          },
          409
        );
        return;
      }

      let issueid = uuid();

      let issueEntry: Issue = {
        id: issueid,
        borrowerid: parsedAuthToken.id,
        lenderid: foundLender.id,
        bookid: foundBook.id,
      };

      const pushed = await ISSUE_DB.pushIssue(issueEntry);

      if (!pushed) {
        sendJsonResponse(res, ERROR.internalErr, 500);
        return;
      }

      sendJsonResponse(
        res,
        {
          error: null,
          message: `successfully created a new issue of id ${issueEntry.id}`,
          data: {
            id: pushed.id,
            borrower: pushed.borrowerid,
            lender: pushed.lenderid,
            book: foundBook.title,
          },
        },
        201
      );
    }
  } finally {
    await ISSUE_DB.close();
    await BOOK_DB.close();
    await USER_DB.close();
  }
}
