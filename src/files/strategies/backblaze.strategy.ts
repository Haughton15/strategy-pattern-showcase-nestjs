// auth-strategies/password-auth.strategy.ts

import { FileStrategy } from "./file-strategy.interface";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

export class BackblazeStrategy implements FileStrategy {
  private s3: AWS.S3;
  async upload(file: Express.Multer.File): Promise<string> {
    this.s3 = new AWS.S3({
      endpoint: process.env.ENDPOINT,
      credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.KEY,
      },
    });

    const uuid = uuidv4();
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: uuid,
      Body: file.buffer,
      ContentType: file.fieldname,
    };
    const response = await this.s3.upload(uploadParams).promise();
    return response.Location;
  }
}
