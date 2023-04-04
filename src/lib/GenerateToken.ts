import { User, TokStatus } from "../common/types";
import { JWT  } from "../common/const"
import { createHmac } from "node:crypto";

export default class Token {
  public generate(user: User, expiresIn?: number): string {
    const head = { algorithm: JWT.ALGO, typ: "JWT"};
    const createdAt = Math.floor(Date.now() / 1000);
    const body = { ...user, iat: createdAt, exp: null}

    if (expiresIn) {
      body.exp = createdAt + expiresIn;
    }

    let b64Head = Buffer.from(JSON.stringify(head)).toString("base64");
    let b64Body = Buffer.from(JSON.stringify(body)).toString("base64");
    let signature = this.sign(`${b64Head}.${b64Body}`);

    return `${b64Head}.${b64Body}.${signature}`
  }

  verify(token: string): TokStatus {
    let [head, body, signature] = token.split('.');
    if (!head || !body || !signature) {
      return TokStatus.INVALID;
    }

    let decodedHead = Buffer.from(head, "base64").toString("utf-8");
    let decodedBody = Buffer.from(body, "base64").toString("utf-8");

    if (this.sign(`${decodedHead}.${decodedBody}`) !== signature) {
      return TokStatus.INVALID_SIG
    }

    const curTime = Math.floor(Date.now() / 1000);
    if (JSON.parse(body)?.exp > curTime) {
      return TokStatus.EXPIRED;
    }

    return TokStatus.VALID
  }


  private sign(data: string): string {
    return createHmac(JWT.HASH, JWT.SECRET)
      .update(data)
      .digest("base64")
      .replace(/=/g, '')
  }
}
