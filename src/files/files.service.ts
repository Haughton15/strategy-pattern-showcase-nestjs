import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { UploadFilesDto } from './dto/upload-files.dto';
import { DataSource, Repository } from 'typeorm';
import { Files } from './entities/files.entity';
import { FilesType } from './entities/files-types.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilesService {
  private readonly s3: AWS.S3;

  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Files)
    private filesRepository: Repository<Files>,
  ) {
    this.s3 = new AWS.S3({
      endpoint: process.env.ENDPOINT,
      credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, uploadFilesDto: UploadFilesDto) {
    const queryRunner = this.datasource.createQueryRunner();

    const fileName = uploadFilesDto.name;
    const uuid = uuidv4();
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: uuid,
      Body: file.buffer,
      ContentType: file.fieldname,
    };

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const response = await this.s3.upload(uploadParams).promise();
      const { name, typeFile } = uploadFilesDto;
      const dbFile = queryRunner.manager.create(Files, {
        name,
        filesType: await queryRunner.manager.findOneBy(FilesType, {
          id: typeFile,
        }),
        src: response.Location,
        uuid: uuid,
      });
      const savedFile = await queryRunner.manager.save(dbFile);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        id: savedFile.id,
        name: savedFile.name,
        src: savedFile.src,
      };
    } catch (error) {
      console.error(`Error uploading file '${fileName}': ${error.message}`);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async deleteFile(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    const file = await queryRunner.manager.findOneBy(Files, { id });

    if (!file) {
      throw new NotFoundException('FILE NOT FOUND');
    }

    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.uuid,
    };

    try {
      await this.s3.deleteObject(deleteParams).promise();
      await this.filesRepository.remove(file);
      return `File '${file.uuid}' deleted successfully`;
    } catch (error) {
      console.error(`Error deleting file '${file.uuid}': ${error.message}`);
      throw error;
    }
  }
}
