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

export interface ErrorBlob {
  message: string,
  error: string,
  status: number,
} 

export const ERROR = {
  internalErr: {
    message: "something went wrong internally",
    status: 500,
    error: "internal-error"
  },

  badRequest: {
    message: "the request was invalid",
    status: 400,
    error: "bad-request"
  }
} 

export enum MIME {
  js = "text/javascript",
  html = "text/html",
  css = "text/css"
}

export const PORT = 8080 || process.env.PORT;

