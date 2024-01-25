import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { User } from '../../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { BaseService } from '../services/base.service';

@ApiUseTags('Base')
@Controller('base')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Post('build')
  async buildStructure(@User() user) {
    return 'ok';
  }
}
