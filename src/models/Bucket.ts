import { BUCKET } from "../common/const";
import { Storage, File} from "megajs";

export default class Bucket {
  bucket: Storage;

  constructor() {
    //this.bucket = new Storage({ email: BUCKET.email, password: BUCKET.password });   
  }

  async init() {
    //this.bucket = await this.bucket.ready;
  }

  async pushBufferWithName(buffer: Buffer, name: string): Promise<string> {

    return "TEMP ADDR"

    /*
    let response = await this.bucket.upload(name, buffer).complete;
    let link = await response.link(false);
    return link;
    */
  }

  async getBufferFromURL(url: string): Promise<Buffer> {
    let file = File.fromURL(url);
    let buffer: Buffer = await new Promise((resolve, reject) => {
      file.downloadBuffer({}, (error, data: Buffer) => {
        if (error) reject(error);
        resolve(data)
      });
    })

    return buffer;
  }

  async close() {
    // syntactical consistency
  }
}
