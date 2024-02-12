import { IsString, MinLength } from "class-validator";

export class UploadFilesDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  typeFile: string;
}
