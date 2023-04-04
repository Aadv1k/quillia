import http from "node:http";
import { sendJsonResponse } from "../common/utils";
import { ERROR } from "../common/const";
import UserModel from "../models/UserModel";
import isEmaiLValid from "../lib/isEmailValid";
import { v4 as uuid } from "uuid";
import { User } from "../common/types";

const DB = new UserModel();

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let data: string;

  try {
    data = await new Promise((resolve, reject) => {
      let rawData: string = "";
      req.on("data", (chunk: string) => (rawData += chunk));
      req.on("end", () => resolve(rawData));
      req.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    sendJsonResponse(res, ERROR.internalErr)
    return;
  }

  let parsedData: User = JSON.parse(data === "" ? '{}' : data);
  if (Object.keys(parsedData).every(e => parsedData[e])) {
    sendJsonResponse(res, ERROR.badRequest);
    return;
  }

  if (!isEmaiLValid(parsedData.email)) {
    sendJsonResponse(res, ERROR.badRequest);
    return;
  }

  let user: User = {
    id: uuid(),
    email: parsedData.email,
    password: parsedData.password,
  } 

  DB.init();

  try {
    DB.pushUser(user)
    sendJsonResponse(res, {
      message: "successfully registered the user",
      error: "",
      status: 200,
    });
  } catch (error) {
    sendJsonResponse(res, ERROR.internalErr);
    return;
  }
  DB.close();
}
