import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ type: 'json' })
  data: any;
}
