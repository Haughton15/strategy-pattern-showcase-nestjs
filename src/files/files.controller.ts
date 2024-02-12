import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common/decorators";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadFilesDto } from "./dto/upload-files.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() files: Express.Multer.File,
    @Body() uploadFilesDto: UploadFilesDto,
  ) {
    return this.filesService.uploadFile(files, uploadFilesDto);
  }
}
