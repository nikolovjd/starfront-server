import { Task } from '../models/task.entity';
import { EntityManager } from 'typeorm';

export interface IResolver {
  getTypes(): string[];
  finishTasks(tasks: Task[], transaction: EntityManager): Promise<void>;
  cancelTask(task: Task, transaction: EntityManager): Promise<void>;
}
