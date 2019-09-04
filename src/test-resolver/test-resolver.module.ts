import { Module } from '@nestjs/common';
import { TestResolverService } from './services/test-resolver.service';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  controllers: [],
  providers: [TestResolverService],
  imports: [SchedulerModule],
  exports: [],
})
export class TestResolverModule {}
