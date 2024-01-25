import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { LoginRequestDto } from '../dto/request/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { AccessTokenRequestDto } from '../dto/request/access-token.dto';

@ApiUseTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Res() res, @Body() data: LoginRequestDto) {
    const user = await this.authService.validateUser(data.email, data.password);

    const tokens = await this.authService.login(user);

    if (data.cookie) {
      res.cookie('auth', tokens.refreshToken, { signed: true });
    }

    return res.json(tokens);
  }

  @Post('access-token')
  async getAccessToken(@Body() data: AccessTokenRequestDto) {
    return await this.authService.getAccessToken(data.refreshToken);
  }

  @UseGuards(AuthGuard())
  @Get('auth-check')
  getProfile(@User() user) {
    return {
      authenticated: true,
      username: user.email,
    };
  }
}
