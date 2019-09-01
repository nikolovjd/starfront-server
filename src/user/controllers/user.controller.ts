import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/request/create-user-request.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: CreateUserRequestDto) {
    console.log('????');
    await this.userService.createUser(data);
  }

  @Post('confirm-email/:token')
  async confirmEmail(@Param('token') token: string) {
    await this.userService.confirmEmail(token);
  }
}
