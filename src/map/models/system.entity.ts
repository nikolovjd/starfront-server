import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Planet } from './planet.entity';
import { Galaxy } from './galaxy.entity';

export interface Point {
  x: number;
  y: number;
}

@Entity()
export class System extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'point',
    nullable: true,
    transformer: {
      from: (v: string) => {
        const matches = v.match(new RegExp('(-?[0-9]+) (-?[0-9]+)'));
        return {
          x: Number(matches[1]),
          y: Number(matches[2]),
        };
      }, // 'POINT(1 2) -> { x: 1, y: 2 }
      to: v => `POINT(${v.x} ${v.y})`, // { x: 1, y: 2 } -> 'POINT(1 2)'
    },
  })
  public coords: Point;

  @OneToMany(type => Planet, planet => planet.system, { cascade: true })
  planets: Planet[];

  @ManyToOne(type => Galaxy, galaxy => galaxy.systems)
  galaxy: Galaxy;

  @Column()
  type: string;
}
