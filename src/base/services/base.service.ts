import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Empire } from '../../empire/models/empire.entity';
import { Base } from '../models/base.entity';
import { Planet } from '../../map/models/planet.entity';

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(Base)
    private readonly baseRepository: Repository<Base>,
  ) {}

  async createBase(empire: Empire, planet: Planet, transaction: EntityManager) {
    const base = this.baseRepository.create({ empire, planet });
    await transaction.save(base);
    return base;
  }
}
