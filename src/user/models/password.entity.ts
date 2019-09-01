import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @OneToOne(type => User, user => user.password, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  setAt: Date;
}
