import { Module } from '@nestjs/common';
import { TestResolverService } from './services/test-resolver.service';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';

@Module({
  controllers: [],
  providers: [TestResolverService],
  imports: [TypeOrmModule.forFeature([Base]), SchedulerModule],
  exports: [],
})
export class TestResolverModule {}
