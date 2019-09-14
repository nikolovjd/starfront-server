import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmpireController } from './controllers/empire.controller';
import { EmpireService } from './services/empire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empire } from './models/empire.entity';
import { MapModule } from '../map/map.module';
import { BaseModule } from '../base/base.module';

@Module({
  controllers: [EmpireController],
  providers: [EmpireService],
  imports: [
    TypeOrmModule.forFeature([Empire]),
    forwardRef(() => AuthModule),
    MapModule,
    BaseModule,
  ],
  exports: [],
})
export class EmpireModule {}
