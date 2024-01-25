import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Base } from '../../base/models/base.entity';

@Entity()
export class Empire extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => User, user => user.empire)
  @JoinColumn()
  user: User;

  @Column({ default: 100 })
  metal: number;

  @Column({ default: 100 })
  crystal: number;

  @Column({ default: 100 })
  deuterium: number;

  @OneToMany(type => Base, base => base.empire)
  bases: Base[];

  @CreateDateColumn()
  createdAt: Date;
}
