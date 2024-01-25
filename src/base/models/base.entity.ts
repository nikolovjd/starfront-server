import {
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Planet } from '../../map/models/planet.entity';
import { Empire } from '../../empire/models/empire.entity';

@Entity()
@Check('urbanCentre >= 1')
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Empire, empire => empire.bases)
  empire: Empire;

  @OneToOne(type => Planet, planet => planet.base)
  @JoinColumn()
  planet: Planet;

  // -- BUILDINGS ---
  @Column({ default: 0 })
  urbanCentre: number;

  @Column({ default: 0 })
  metalMine: number;

  @Column({ default: 0 })
  crystalMine: number;

  @Column({ default: 0 })
  deuteriumMine: number;
}
