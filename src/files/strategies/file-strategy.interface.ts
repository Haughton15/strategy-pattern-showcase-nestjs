export interface FileStrategy {
  upload(file: Express.Multer.File): Promise<string>;
}
