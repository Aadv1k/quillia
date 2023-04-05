import { BUCKET } from "../common/const";
import { Storage } from "megajs";

export default class Bucket {
  bucket: Storage;

  constructor() {
    this.bucket = new Storage({ email: BUCKET.email, password: BUCKET.password });   
  }

  async init() {
    this.bucket = await this.bucket.ready;
  }

  async pushBufferWithName(buffer: Buffer, name: string): Promise<string> {
    let response = await this.bucket.upload(name, buffer).complete;
    let link = await response.link(false);
    return link;
  }

  async close() {
    // syntactical consistency
  }
}
