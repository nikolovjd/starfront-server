import { Task } from '../models/task.entity';
import { EntityManager } from 'typeorm';

export interface IResolver {
  getTypes(): string[];
  finishTask(task: Task, transaction: EntityManager): Promise<void>;
  cancelTask(task: Task, transaction: EntityManager): Promise<void>;
}
