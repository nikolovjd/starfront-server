import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  a: number;

  @Column({ default: 0 })
  b: number;

  @Column({ default: 0 })
  c: number;

  @Column({ default: 0 })
  d: number;

  @Column({ default: 0 })
  e: number;
}
