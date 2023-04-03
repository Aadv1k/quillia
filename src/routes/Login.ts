import http from "node:http";
import { sendJsonResponse } from "../common/utils";
import { ERROR } from "../common/const";

interface ExistingUser {
  email: string;
  password: string;
}

export default async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let data: string | undefined;
  try {
    data = await new Promise((resolve, reject) => {
      let rawData: string = "";
      req.on("data", (chunk: string) => (rawData += chunk));
      req.on("end", () => resolve(rawData));
      req.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    sendJsonResponse(res, ERROR.internalErr);
    return;
  }

  let parsedData: ExistingUser;
  try {
   parsedData = JSON.parse(data) as ExistingUser | undefined;
  } catch (error) {
    sendJsonResponse(res, ERROR.badRequest);
    return;
  }
  if (!parsedData) {
    sendJsonResponse(res, ERROR.badRequest);
    return;
  }
  console.log(parsedData);
}
