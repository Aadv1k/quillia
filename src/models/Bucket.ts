import { CLOUDINARY_CONF } from "../common/const";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

import fs from "node:fs";
import path from "node:path";

export default class Bucket {
  bucket: any;
  isLocal: boolean;
  bucketPath: string;

  constructor() {
    this.isLocal = false;
    if (!CLOUDINARY_CONF.API_SECRET) {
      this.isLocal = true;
      this.bucketPath = path.join(__dirname, "../BUCKET");
    } else {
      cloudinary.config({
        cloud_name: CLOUDINARY_CONF.CLOUD_NAME,
        api_key: CLOUDINARY_CONF.API_KEY,
        api_secret: CLOUDINARY_CONF.API_SECRET
      })
      this.bucket = cloudinary;
    }
  }

  async init() {
    if (this.isLocal) {
      await new Promise((_, _a) => {
        fs.mkdir(this.bucketPath, (_b) => {});
      })    
    }
    // syntactical consistency
  }

  async pushBufferWithName(buffer: Buffer, name: string): Promise<string | null> {
    const stream = new Readable({
      read: function() {
        this.push(buffer);
        this.push(null);
      }
    });

    console.log(this.isLocal)
    if (this.isLocal) {
      let p = path.join(this.bucketPath, name);
      console.log(p);
      fs.writeFileSync(p, buffer);
      return p;
    }

    let response = new Promise((resolve, reject) => {
      const writeStream = this.bucket.uploader.upload_stream({
        public_id: name,
        resource_type: "raw",
        format: name.split('.').pop() // ideally "unsafe" files should not reach this point
      }, (error: any, result: any) => {
        if (error) reject(error);
        resolve(result);
      })
      stream.pipe(writeStream);
    })

    try {
      let data: any = await response;
      return data.secure_url;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async close() {
    // syntactical consistency
  }
}
