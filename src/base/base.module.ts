import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';
import { BaseService } from './services/base.service';

@Module({
  controllers: [],
  providers: [BaseService],
  imports: [TypeOrmModule.forFeature([Base]), forwardRef(() => AuthModule)],
  exports: [BaseService],
})
export class BaseModule {}
