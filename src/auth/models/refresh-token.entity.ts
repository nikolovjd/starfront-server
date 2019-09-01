import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/models/user.entity';

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 64 })
  token: string;

  @Column({ default: false })
  blacklisted: boolean;

  @Column({ nullable: true })
  blacklistedReason: string;

  @ManyToOne(type => User, user => user.refreshTokens, { cascade: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
