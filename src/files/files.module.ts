import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './entities/files.entity';
import { FilesType } from './entities/files-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files, FilesType])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
