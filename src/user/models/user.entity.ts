import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Password } from './password.entity';
import { EmailConfirmationToken } from './email-confirmation-token.entity';
import { RefreshToken } from '../../auth/models/refresh-token.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @OneToOne(type => Password, password => password.user)
  password: Password;

  @OneToMany(type => EmailConfirmationToken, token => token.user)
  emailConfirmationTokens: EmailConfirmationToken[];

  @OneToMany(type => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];
}
