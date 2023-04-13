import http from "node:http";
import { sendJsonResponse, md5, parseSimplePostData } from "../common/utils";
import Token from "../lib/GenerateToken";
import { ERROR } from "../common/const";
import UserModel from "../models/UserModel";
import { User } from "../common/types";


export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const DB = new UserModel();

  let data: any = await parseSimplePostData(req);
  data = data.toString();

  if (req.method !== "POST") {
    sendJsonResponse(res, ERROR.methodNotAllowed, 405);
    return;
  }

  let parsedData: User;

  try {
    parsedData = JSON.parse(data);
  } catch(error) {
    sendJsonResponse(res, ERROR.invalidJSONData, 400)
    return;
  }

  await DB.init();
  const foundUser: User = await DB.getUser(parsedData.email);
  await DB.close();

  if (!foundUser) {
    sendJsonResponse(res, ERROR.userNotFound, 404);
    return;
  }

  if (md5(parsedData.password) !== foundUser.password) {
    sendJsonResponse(res, ERROR.unauthorized, 401);
    return;
  }

  const token = new Token();
  const { password, ...tokenBody} = foundUser;
  let accessToken = token.generate(tokenBody);

  sendJsonResponse(res, {
    messaged: "found the given user",
    status: 200,
    error: null,
    token: accessToken,
    data: {
      email: foundUser.email,
      id: foundUser.id,
    }
  }, 200)
}
