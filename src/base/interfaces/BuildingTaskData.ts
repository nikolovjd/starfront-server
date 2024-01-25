import { Buildings } from '../data/buildings.data';
import { Cost } from '../../empire/interfaces/cost.interface';

export interface BuildingTaskData {
  building: Buildings;
  cost: Cost;
  baseId: number;
}
