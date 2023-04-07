import { CLOUDINARY_CONF } from "../common/const";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

export default class Bucket {
  bucket: any;

  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CONF.CLOUD_NAME,
      api_key: CLOUDINARY_CONF.API_KEY,
      api_secret: CLOUDINARY_CONF.API_SECRET
    });
    this.bucket = cloudinary;
  }

  async init() {
    // syntactical consistency
  }

  async pushBufferWithName(buffer: Buffer, name: string): Promise<string | null> {
    const stream = new Readable({
      read: function() {
        this.push(buffer);
        this.push(null);
      }
    });


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
