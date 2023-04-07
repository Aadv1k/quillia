import http from "node:http";

import { sendJsonResponse, md5, uuid, parseSimplePostData } from "../common/utils";
import { ERROR } from "../common/const";
import { User } from "../common/types";

import UserModel from "../models/UserModel";
import Token from "../lib/GenerateToken";
import isEmailValid from "../lib/isEmailValid";

const DB = new UserModel();

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  if (req.method !== "POST") {
    sendJsonResponse(res, ERROR.methodNotAllowed, 405);
    return;
  }

  let data: any = await parseSimplePostData(req);
  data = data.toString();
  let parsedData: User;

  try {
    parsedData = JSON.parse(data === "" ? '{}' : data);
  } catch {
    sendJsonResponse(res, ERROR.invalidJSONData, 400)
    return;
  }

  if (!parsedData.email || !parsedData.password) {
    sendJsonResponse(res, ERROR.badRequest, 400);
    return;
  }

  if (!isEmailValid(parsedData.email)) {
    sendJsonResponse(res, ERROR.badRequest, 400);
    return;
  }


  await DB.init();

  let userExists = await DB.getUser(parsedData.email);

  if (userExists) {
    sendJsonResponse(res, ERROR.userAlreadyExists, 409)
    return;
  }

  let user: User = {
    id: uuid(),
    email: parsedData.email,
    password: md5(parsedData.password),
  } 

  const token = new Token();

    let pushed = await DB.pushUser(user)
    const { password, ...tokenBody} = user;
    let accessToken = token.generate(tokenBody);

  if (pushed !== null) {
    sendJsonResponse(res, {
      status: 201,
      message: "successfully created new user",
      error: null,
      token: accessToken
    }, 201)
  } else {
    sendJsonResponse(res, ERROR.internalErr, 500);
  }

  await DB.close();
}
