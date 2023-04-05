export interface User {
  id?: string,
  email: string;
  password: string;
}

export interface Book {
  id: string,
  userid: string,
  title: string,
  author: string,
  createdAt: number,
  path: string 
  sig: string
}

export enum TokStatus {
  EXPIRED,
  INVALID,
  INVALID_SIG,
  VALID
}
