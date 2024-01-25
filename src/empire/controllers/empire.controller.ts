import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { EmpireService } from '../services/empire.service';
import { User } from '../../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('Empire')
@Controller('empire')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class EmpireController {
  constructor(private readonly empireService: EmpireService) {}

  @Get()
  async findEmpire(@User() user) {
    return this.empireService.getEmpire(user);
  }

  @Post()
  async createEmpire(@User() user) {
    const empire = await this.empireService.createEmpire(user);
    return { id: empire.id };
  }
}
