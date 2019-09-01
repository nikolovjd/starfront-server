import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Check(`char_length(token) = 48`)
export class EmailConfirmationToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 48, unique: true })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  usedAt: Date;

  @ManyToOne(type => User, user => user.emailConfirmationTokens, {
    onDelete: 'CASCADE',
  })
  user: User;
}
