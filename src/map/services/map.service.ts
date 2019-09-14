import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Galaxy } from '../models/galaxy.entity';
import { User } from '../../user/models/user.entity';
import { Planet } from '../models/planet.entity';
import { PlanetTypes } from '../data/planets.data';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Galaxy)
    private readonly galaxyRepository: Repository<Galaxy>,
  ) {}

  public async getMap(user: User) {
    // TODO: Visibility

    const galaxy = await this.galaxyRepository.findOne({
      relations: ['systems'],
    });

    return galaxy;
  }

  public async getStarterPlanet(transaction: EntityManager) {
    const planet = await transaction.findOne(
      Planet,
      {
        base: null,
        type: PlanetTypes.CONTINENTAL,
      },
      { relations: ['base'] },
    );
    return planet;
  }
}
