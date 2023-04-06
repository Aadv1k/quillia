export interface User {
  id?: string,
  email: string;
  password: string;
}

export interface Issue {
  id: string,
  lenderid: string,
  borrowerid: string,
  bookid: string
}

export interface Book {
  id: string,
  userid: string,
  title: string,
  author: string,
  path: string,
  signature: string
  cover?: string,
}

export enum TokStatus {
  EXPIRED,
  INVALID,
  INVALID_SIG,
  VALID
}
