import { Injectable } from "@nestjs/common";
import { UploadFilesDto } from "./dto/upload-files.dto";
import { DataSource, Repository } from "typeorm";
import { Files } from "./entities/files.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FileStrategy } from "./strategies/file-strategy.interface";
import { BackblazeStrategy } from "./strategies/backblaze.strategy";
import { CloudinaryStrategy } from "./strategies/cloudinary.strategt";
import { FilesType } from "./entities/files-types.entity";

@Injectable()
export class FilesService {
  strategy: FileStrategy;
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Files)
    private filesRepository: Repository<Files>,
  ) {}

  setStrategy(strategy: FileStrategy) {
    this.strategy = strategy;
  }

  async uploadFile(file: Express.Multer.File, uploadFilesDto: UploadFilesDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (uploadFilesDto.typeFile === "1") {
        this.setStrategy(new BackblazeStrategy());
      } else {
        this.setStrategy(new CloudinaryStrategy());
      }
      const response = await this.strategy.upload(file);
      const lastSegment: string = response.split("/").pop() as string;
      const { name, typeFile } = uploadFilesDto;
      const fileType = parseInt(typeFile, 10);

      const dbFile = queryRunner.manager.create(Files, {
        name,
        filesType: await queryRunner.manager.findOneBy(FilesType, {
          id: fileType,
        }),
        src: response,
        uuid: lastSegment,
      });
      const savedFile = await queryRunner.manager.save(dbFile);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return savedFile;
    } catch (error) {
      console.error(
        `Error uploading file '${uploadFilesDto.name}': ${error.message}`,
      );
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}
