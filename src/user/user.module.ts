import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Password } from './models/password.entity';
import { EmailConfirmationToken } from './models/email-confirmation-token.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([Password, User, EmailConfirmationToken]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
