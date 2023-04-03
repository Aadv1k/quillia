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
    error: "bad_request"
  }
} 

export enum MIME {
  js = "text/javascript",
  html = "text/html",
  css = "text/css"
}

export const PORT = 8080 || process.env.PORT;

