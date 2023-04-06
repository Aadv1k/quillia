import IssueModel from "../models/IssueModel";
import BookModel from "../models/BookModel";
import UserModel from "../models/UserModel";

import Bucket from "../models/Bucket";
import Token from "../lib/GenerateToken";
import { ERROR, MAX_EPUB_SIZE_MB } from "../common/const";
import { TokStatus, Book, Issue, User} from "../common/types";
import { sendJsonResponse, parseSimplePostData, md5 } from "../common/utils";

import filetype from "file-type-cjs";

import { v4 as uuid } from "uuid";

import http from "node:http";

const BUCKET = new Bucket();

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const ISSUE_DB = new IssueModel();
  const BOOK_DB = new BookModel();
  const USER_DB = new UserModel();

  await ISSUE_DB.init();
  await BOOK_DB.init();
  await USER_DB.init();

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
      let userIssues = await ISSUE_DB.getIssues(parsedAuthToken.id);

      if (!userIssues) {
        sendJsonResponse(res, ERROR.internalErr, 500);
        return;
      }

      sendJsonResponse(res, userIssues, 200);
    } catch (error) {
      console.error(error);
      sendJsonResponse(res, ERROR.internalErr, 500);
    } finally {
      await ISSUE_DB.close();
      return;
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
      sendJsonResponse(res, ERROR.badRequest, 400)
      return;
    }

    if (!issueData.borrowerid ||  !issueData.id) {
      sendJsonResponse(res, ERROR.badRequest, 400)
      return;
    }

    let foundBorrower = await USER_DB.getUser("", issueData.borrowerid);
    let foundBook = await BOOK_DB.getBook(issueData.bookid);

    if (!foundBorrower || !foundBook) {
      sendJsonResponse(res, ERROR.resourceNotExists, 404)
      return;
    }

    let foundIssue = await ISSUE_DB.getIssue("", "", parsedAuthToken.id)

    if (foundIssue) {
      sendJsonResponse(
        res,
        {
          ...ERROR.resourceExists,
          data: {
            id: foundIssue.id,
          },
        },
        409
      );
      return;
    }

    let issueid = uuid();

    let issueEntry: Issue = { 
      id: issueid,
      borrowerid: foundBorrower.id,
      lenderid: parsedAuthToken.id,
      bookid: foundBook.id
    }

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
          book: foundBook.title,
        },
      },
      201
    );

    await ISSUE_DB.close();
    await BOOK_DB.close();
    await USER_DB.close();
    return;
  }
}
