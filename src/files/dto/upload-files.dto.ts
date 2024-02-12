import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class UploadFilesDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsNumber()
  @IsPositive()
  typeFile: number;
}
