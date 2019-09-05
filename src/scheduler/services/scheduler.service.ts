import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { Task } from '../models/task.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { CronJob } from 'cron';

import * as moment from 'moment';
import { ITask } from '../interfaces/task.interface';
import { IResolver } from '../interfaces/resolver.interface';

interface StoredResolver {
  id: number;
  resolver: IResolver;
}

interface ResolverDispatch {
  resolver: StoredResolver;
  tasks: Task[];
}

@Injectable()
export class SchedulerService implements OnModuleInit {
  private ticking = false;
  private taskQueue: Task[] = [];
  private resolvers: Map<string, StoredResolver[]> = new Map();
  private tickCron: CronJob;
  private nextResolverId = 1;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {
    this.tickCron = new CronJob('* * * * * *', this.tick.bind(this));
  }

  public async addTask(data: ITask): Promise<Task> {
    const task = this.createTask(data);
    await task.save();
    this.insertTask(task);
    return task;
  }

  public addResolver(resolver: IResolver): void {
    const types: string[] = resolver.getTypes();

    for (const type of types) {
      let resolvers = this.resolvers.get(type);

      if (!resolvers) {
        resolvers = [];
      }

      const storedResolver = {
        id: this.nextResolverId++,
        resolver,
      };

      resolvers.push(storedResolver);
      this.resolvers.set(type, resolvers);
    }
  }

  private createTask(data: ITask): Task {
    const start = moment().set({ milliseconds: 0 });
    const end = start.clone().add({ second: data.duration });

    return this.taskRepository.create({
      status: TaskStatus.IN_PROGRESS,
      type: data.type,
      data: data.data,
      start: start.toDate(),
      end: end.toDate(),
    });
  }

  private insertTask(task: Task): void {
    const insertIndex = this.findInsertIndex(task);

    if (insertIndex >= this.taskQueue.length) {
      this.taskQueue.push(task);
    } else {
      console.time;
      this.taskQueue.splice(insertIndex + 1, 0, task);
    }
  }

  private removeTask(task: Task) {
    const deleteIndex = this.findDeleteIndex(task);

    if (deleteIndex === -1) {
      // TODO: handle?
      return;
    }

    this.taskQueue.splice(deleteIndex, 1);
  }

  private findInsertIndex(task: Task): number {
    let beginning = 0;
    let end = this.taskQueue.length;
    let pivot = ~~(this.taskQueue.length / 2);

    const time = task.end.getTime();

    while (beginning !== end) {
      if (time < this.taskQueue[pivot].end.getTime()) {
        if (pivot !== end) {
          end = pivot;
        } else {
          end = pivot - 1;
        }
        pivot = beginning + ~~((end - beginning) / 2);
      } else {
        if (pivot !== beginning) {
          beginning = pivot;
        } else {
          beginning = pivot + 1;
        }
        pivot = beginning + ~~((end - beginning) / 2);
      }
    }

    if (!this.taskQueue[pivot]) {
      return pivot;
    }

    if (this.taskQueue[pivot].end.getTime() === time) {
      return pivot + 1;
    }

    if (time < this.taskQueue[pivot].end.getTime()) {
      return pivot - 1;
    } else {
      return pivot + 1;
    }
  }

  private findDeleteIndex(task: Task) {
    return this.taskQueue.findIndex(t => t.id === task.id);
    /*const time = task.end;
    const id = task.id;

    let beginning = 0;
    let end = this.taskQueue.length;
    let pivot = ~~(this.taskQueue.length / 2);

    while (beginning !== end) {
      if (time < this.taskQueue[pivot].end) {
        if (pivot !== end) {
          end = pivot;
        } else {
          end = pivot - 1;
        }
      } else if (time > this.taskQueue[pivot].end) {
        if (pivot !== beginning) {
          beginning = pivot;
        } else {
          beginning = pivot + 1;
        }
        beginning = pivot;
      } else {
        // find the start of the elements with the same time
        while (pivot > beginning) {
          if (
            this.taskQueue[pivot - 1] &&
            this.taskQueue[pivot - 1].end === time
          ) {
            pivot--;
          } else {
            break;
          }
        }
        // find the element
        while (pivot < end) {
          if (this.taskQueue[pivot].id === id) {
            return pivot;
          }
          pivot++;
        }
        return -1;
      }
      pivot = beginning + ~~((end - beginning) / 2);
    }

    if (this.taskQueue[pivot].id === id) {
      return pivot;
    } else {
      return -1;
    }*/
  }

  private async tick() {
    try {
      const d = new Date().toISOString();
      console.time(`scheduler tick ${d}`);
      const tickTasks = this.getTasksForTick();
      console.log('Tasks: ', tickTasks.length);

      if (!tickTasks.length) {
        console.timeEnd(`scheduler tick ${d}`);
        return;
      }

      const resolversDispatch: ResolverDispatch[] = [];

      // Get resolvers
      for (const task of tickTasks) {
        const type = task.type;
        const resolvers = this.resolvers.get(type);

        for (const resolver of resolvers) {
          const existingResolverInDispatch = resolversDispatch.find(
            r => r.resolver.id === resolver.id,
          );

          if (!existingResolverInDispatch) {
            resolversDispatch.push({ resolver, tasks: [task] });
          } else {
            existingResolverInDispatch.tasks.push(task);
          }
        }
      }

      const transactions = [];

      for (const { resolver, tasks } of resolversDispatch) {
        for (const task of tasks) {
          const transaction = this.connection.transaction(async transaction => {
            await resolver.resolver.finishTask(task, transaction);
            await this.setTaskToFinished(task, transaction);
            this.removeTask(task);
          });

          transactions.push(transaction);
        }
      }

      await Promise.all(transactions);
      console.timeEnd(`scheduler tick ${d}`);
    } catch (err) {
      console.log(err);
    }
  }

  private getTasksForTick(): Task[] {
    const time = Date.now();

    const tasks: Task[] = [];

    for (const task of this.taskQueue) {
      if (task.end.getTime() <= time) {
        tasks.push(task);
      } else {
        break;
      }
    }

    return tasks;
  }

  private async setTaskToFinished(task: Task, transaction: EntityManager) {
    task.status = TaskStatus.FINISHED;

    await transaction.save(task);
  }

  async onModuleInit(): Promise<void> {
    // TODO: Load tasks from DB
    this.tickCron.start();
  }
}
