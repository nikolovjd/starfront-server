import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';
import { BaseService } from './services/base.service';
import { EmpireModule } from '../empire/empire.module';

@Module({
  controllers: [],
  providers: [BaseService],
  imports: [
    TypeOrmModule.forFeature([Base]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmpireModule),
  ],
  exports: [BaseService],
})
export class BaseModule {}
