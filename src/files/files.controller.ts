import {
  Body,
  Controller,
  Param,
  Post,
  UseInterceptors,
  Delete,
  UploadedFile,
} from '@nestjs/common/decorators';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() files: Express.Multer.File,
    @Body() uploadFilesDto: UploadFilesDto,
  ) {
    console.log(uploadFilesDto);
    return this.filesService.uploadFile(files, uploadFilesDto);
  }

  @Delete('delete/:id')
  async deleteFiles(@Param('id') id: number) {
    return this.filesService.deleteFile(id);
  }
}
