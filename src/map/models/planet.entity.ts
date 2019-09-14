import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Point, System } from './system.entity';
import { pointTransformer } from './utils';
import { PlanetTypes } from '../data/planets.data';
import { Base } from '../../base/models/base.entity';

@Entity()
export class Planet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => System, system => system.planets)
  system: System;

  @Column({
    type: 'point',
    nullable: true,
    transformer: {
      from: pointTransformer,
      to: v => `POINT(${v.x} ${v.y})`, // { x: 1, y: 2 } -> 'POINT(1 2)'
    },
  })
  public coords: Point;

  @OneToOne(type => Base, base => base.planet)
  base: Base;

  @Column({ type: 'enum', enum: PlanetTypes })
  type: PlanetTypes;
}
