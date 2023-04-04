export interface User {
  id?: string,
  email: string;
  password: string;
}

export enum TokStatus {
  EXPIRED,
  INVALID,
  INVALID_SIG,
  VALID
}
