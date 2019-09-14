import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { System } from './system.entity';

@Entity()
export class Galaxy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => System, system => system.galaxy, { cascade: true })
  systems: System[];

  @Column()
  type: string;
}
