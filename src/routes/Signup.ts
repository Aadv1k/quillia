import http from "node:http";

import { sendJsonResponse, md5 } from "../common/utils";
import { ERROR } from "../common/const";
import { User } from "../common/types";

import UserModel from "../models/UserModel";
import Token from "../lib/GenerateToken";
import isEmailValid from "../lib/isEmailValid";
import { v4 as uuid } from "uuid";

const DB = new UserModel();

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let data: string;
  await DB.init();


  if (req.method !== "POST") {
    sendJsonResponse(res, ERROR.methodNotAllowed);
    return;
  }

  try {
    data = await new Promise((resolve, reject) => {
      let rawData: string = "";
      req.on("data", (chunk: string) => (rawData += chunk));
      req.on("end", () => resolve(rawData));
      req.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    sendJsonResponse(res, ERROR.internalErr, 500)
    return;
  }


  let parsedData: User 
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

  if (await DB.userExists(parsedData.email)) {
    sendJsonResponse(res, ERROR.userAlreadyExists, 409)
    return;
  }

  let user: User = {
    id: uuid(),
    email: parsedData.email,
    password: md5(parsedData.password),
  } 


  const token = new Token();

  try {
    await DB.pushUser(user)
    let accessToken = token.generate(user);
    sendJsonResponse(res, {
      status: 201,
      message: "successfully created new user",
      error: null,
      token: accessToken
    }, 201)

  } catch (error) {
    sendJsonResponse(res, ERROR.internalErr, 500);
    return;
  }
}
