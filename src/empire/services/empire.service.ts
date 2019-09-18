import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { Empire } from '../models/empire.entity';
import { User } from '../../user/models/user.entity';
import { MapService } from '../../map/services/map.service';
import { BaseService } from '../../base/services/base.service';
import { Cost } from '../interfaces/cost.interface';

@Injectable()
export class EmpireService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Empire)
    private readonly empireRepository: Repository<Empire>,
    private readonly mapService: MapService,
    private readonly baseService: BaseService,
  ) {}

  async getEmpire(user: User) {
    const empire = await this.empireRepository.findOne({ where: { user } });
    return empire;
  }

  async createEmpire(user: User) {
    const empire = this.empireRepository.create({ user });
    try {
      await this.connection.transaction(async transaction => {
        await transaction.save(empire);
        const planet = await this.mapService.getStarterPlanet(transaction);
        const base = await this.baseService.createBase(
          empire,
          planet,
          transaction,
        );
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('empire_already_exists');
      } else {
        throw err;
      }
    }
    return empire;
  }

  async chargeCost(user: User, cost: Cost, transaction: EntityManager) {
    const empire = await transaction.findOne(Empire, { user });
    // TODO: check in DB with Check constraint after mysql container update....
    // not enough resources
    if (
      empire.metal - cost.metal < 0 ||
      empire.crystal - cost.crystal < 0 ||
      empire.deuterium - cost.deuterium < 0
    ) {
      throw new BadRequestException('not_enough_resources');
    }

    empire.metal -= cost.metal;
    empire.crystal -= cost.crystal;
    empire.deuterium -= cost.deuterium;

    await transaction.save(empire);
  }
}
