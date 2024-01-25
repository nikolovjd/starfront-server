import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MapController } from './controllers/map.controller';
import { MapService } from './services/map.service';
import { Galaxy } from './models/galaxy.entity';
import { System } from './models/system.entity';
import { Planet } from './models/planet.entity';

@Module({
  controllers: [MapController],
  providers: [MapService],
  imports: [
    TypeOrmModule.forFeature([Galaxy, System, Planet]),
    forwardRef(() => AuthModule),
  ],
  exports: [MapService],
})
export class MapModule {}
