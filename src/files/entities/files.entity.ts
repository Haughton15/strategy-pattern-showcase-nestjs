import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FilesType } from './files-types.entity';

@Entity({
  name: 'files',
})
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 125,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'src',
    type: 'varchar',
    length: 125,
    nullable: true,
    unique: true,
  })
  src: string;

  @Column({
    name: 'uuid',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  uuid: string;

  @ManyToOne(() => FilesType, (filesType) => filesType.files)
  @JoinColumn({ name: 'file_type_id' })
  filesType: FilesType;
}
