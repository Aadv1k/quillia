import http from "node:http";
import { sendJsonResponse } from "../common/utils";
import { ERROR } from "../common/const";

interface User {
  email: string;
  password: string;
}

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
}
