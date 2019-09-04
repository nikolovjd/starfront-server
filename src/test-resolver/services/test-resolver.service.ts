import { Injectable, OnModuleInit } from '@nestjs/common';
import { IResolver } from '../../scheduler/interfaces/resolver.interface';
import { Task } from '../../scheduler/models/task.entity';
import { EntityManager } from 'typeorm';
import { SchedulerService } from '../../scheduler/services/scheduler.service';

import { CronJob } from 'cron';

@Injectable()
export class TestResolverService implements OnModuleInit, IResolver {
  private tickCron: CronJob;
  constructor(private readonly scheduler: SchedulerService) {
    scheduler.addResolver(this);

    this.tickCron = new CronJob('* * * * * *', this.tick.bind(this));
  }

  async cancelTask(task: Task, transaction: EntityManager): Promise<void> {
    console.log('Task canceled');
  }

  async finishTasks(tasks: Task[], transaction: EntityManager): Promise<void> {
    console.log('TASKS FINISHED');
  }

  async tick() {}

  getTypes(): string[] {
    return ['test'];
  }

  onModuleInit(): any {}
}
