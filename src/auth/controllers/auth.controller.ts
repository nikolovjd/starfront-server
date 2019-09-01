import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { LoginRequestDto } from '../dto/request/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Get('me')
  getProfile(@Req() request) {
    return request.user;
  }
}
