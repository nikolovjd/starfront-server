import { Controller, Get } from '@nestjs/common';
import { MapService } from '../services/map.service';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { User } from '../../auth/decorators/user.decorator';

@Controller('map')
@ApiUseTags('Map')
@ApiBearerAuth()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('/galaxy')
  async getMap(@User() user) {
    const map = await this.mapService.getMap(user);

    return map;
  }
}
