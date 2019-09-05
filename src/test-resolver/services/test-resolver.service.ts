import { Injectable, OnModuleInit } from '@nestjs/common';
import { IResolver } from '../../scheduler/interfaces/resolver.interface';
import { Task } from '../../scheduler/models/task.entity';
import { EntityManager } from 'typeorm';
import { SchedulerService } from '../../scheduler/services/scheduler.service';

import { CronJob } from 'cron';
import { ITask } from '../../scheduler/interfaces/task.interface';
import { Base } from '../models/base.entity';

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

  async finishTask(task: Task, transaction: EntityManager): Promise<void> {
    await transaction.increment(
      Base,
      { id: task.data.baseId },
      task.data.building,
      1,
    );
  }

  async tick() {
    const d = new Date().toISOString();
    console.time(`resolver tick ${d}`);
    // add from 1000 to 10000 tasks
    const amount = 100;
    const tasks: ITask[] = [];
    const buildings = ['a', 'b', 'c', 'd', 'e'];

    for (let i = 0; i < amount; i++) {
      // duration from 1 to 5000 seconds
      // base ID from 1 to 1000
      // Random building

      tasks.push({
        type: 'building',
        duration: 3,
        data: {
          baseId: Math.floor(Math.random() * (1001 - 1) + 1),
          building: buildings[Math.floor(Math.random() * buildings.length)],
        },
      });
    }

    const t = new Date().toISOString();
    const promises = [];
    for (const task of tasks) {
      promises.push(this.scheduler.addTask(task));
    }
    await Promise.all(promises);
    console.timeEnd(`resolver tick ${d}`);
  }

  async catchupDowntimeTask(
    task: any,
    transaction: EntityManager,
  ): Promise<void> {
    // TODO: implement a way to handle income ticks and calculate properly
    await this.finishTask(task, transaction);
  }

  getTypes(): string[] {
    return ['building'];
  }

  onModuleInit(): any {
    // this.tickCron.start();
  }
}
