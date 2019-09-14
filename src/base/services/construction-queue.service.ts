import { Injectable } from '@nestjs/common';
import { IResolver } from '../../scheduler/interfaces/resolver.interface';
import { Task } from '../../scheduler/models/task.entity';
import { EntityManager } from 'typeorm';
import { SchedulerService } from '../../scheduler/services/scheduler.service';

import { ITask } from '../../scheduler/interfaces/task.interface';
import { Base } from '../models/base.entity';

@Injectable()
export class ConstructionQueueService implements IResolver {
  constructor(private readonly scheduler: SchedulerService) {
    scheduler.addResolver(this);
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

  async build(base: Base, building: string) {}

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
}
