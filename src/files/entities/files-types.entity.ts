import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Files } from './files.entity';

@Entity({
  name: 'files-type',
})
export class FilesType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 20,
  })
  name: string;

  @OneToMany(() => Files, (files) => files.filesType)
  files: Files[];
}
