import { Module } from '@nestjs/common';
import { SchedulerService } from './services/scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './models/task.entity';

@Module({
  controllers: [],
  providers: [SchedulerService],
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [SchedulerService],
})
export class SchedulerModule {}
