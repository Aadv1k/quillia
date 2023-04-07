import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

export const DB = {
  USER: process.env.PG_USER,
  HOST: process.env.PG_HOST,
  PORT: parseInt(process.env.PG_PORT),
  DB_NAME: process.env.PG_DB,
  PASSWORD: process.env.PG_PASSWORD,
}

export const CLOUDINARY_CONF = {
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUD_NAME: "dbloby3uq",

}

export const JWT = {
  SECRET: process.env.JWT_SECRET ?? "default",
  ALGO: "HS256",
  HASH: "sha256"
}

export const ERROR = {
  internalErr: {
    message: "something went wrong internally",
    status: 500,
    error: "internal-error"
  },

  invalidChapterID: {
    message: "the chapter id requested for the issue was invalid",
    status: 400,
    error: "invalid-chapter-id"
  },

  chapterOutOfRange: {
    message: "the requested chapter was out of range",
    status: 400,
    error: "chapter-out-of-range"
  },

  resourceExists: {
    message: "resource already exists",
    status: 409,
    error: "resource-exists"
  },

  resourceNotExists: {
    message: "resource does not exist",
    status: 404,
    error: "resource-not-found"
  },

  unauthorized: {
    message: "the given credentials were invalid",
    status: 401,
    error: "unauthorized"
  },

  userNotFound: {
    message: "unable to find user",
    status: 404,
    error: "user-not-found"
  },

  methodNotAllowed: {
    message: "the method is not allowed for the endpoint",
    status: 405,
    error: "method-not-allowed"
  },
  
  userAlreadyExists: {
    message: "the given user already exists, login instead.",
    status: 409,
    error: "user-already-exists"
  },

  invalidJSONData: {
    message: "received invalid JSON data",
    status: 400,
    error: "invalid-json-data"
  },

  invalidMimeForResource: {
    message: "the mime recieved for the resource is not valid",
    status: 415,
    error: "invalid-mime-for-resource"
  },

  badRequest: {
    message: "the request was invalid",
    status: 400,
    error: "bad-request"
  },

  fileTooLarge: {
    message: "the file is too large",
    status: 400,
    error: "file-too-large",
  }
} 

export enum MIME {
  js = "text/javascript",
  html = "text/html",
  css = "text/css"
}

export const PORT = 8080 || process.env.PORT;
export const MAX_EPUB_SIZE_MB = 20;


