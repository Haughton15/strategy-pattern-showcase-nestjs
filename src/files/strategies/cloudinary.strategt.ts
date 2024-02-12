// auth-strategies/cloudinary-strategy.ts

import { FileStrategy } from "./file-strategy.interface";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";

export class CloudinaryStrategy implements FileStrategy {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async upload(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uuid = uuidv4();
      // Opcional: ajustar el nombre del archivo o la ruta aquí
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: `uploads/${uuid}`, resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.url);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
