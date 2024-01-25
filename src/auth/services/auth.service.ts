import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../models/refresh-token.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/models/user.entity';

@Injectable()
export class AuthService {
  // TODO: Config
  private emailTokenBytes = 24;
  private refreshTokenBytes = 32;
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(user: User) {
    const refreshToken = await this.generateRefreshToken(user);
    const payload = {
      email: user.email,
      sub: user.id,
      parent: refreshToken.id,
    };

    return {
      refreshToken: refreshToken.token,
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async getAccessToken(token: string) {
    const { id, user } = await this.validateRefreshToken(token);

    const payload = {
      email: user.email,
      sub: id,
      parent: id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(email, ['password']);
    if (!user) {
      throw new UnauthorizedException();
    }

    const authorized = await this.verifyPassword(pass, user.password.hash);

    if (!authorized) {
      throw new UnauthorizedException();
    }

    // Remove password
    delete user.password;

    return user;
  }

  public generateEmailConfirmationToken() {
    const buffer = crypto.randomBytes(this.emailTokenBytes);
    return buffer.toString('hex');
  }

  public async generateRefreshToken(user: User) {
    const refreshToken = this.refreshTokenRepository.create();

    let saved = false;

    while (!saved) {
      try {
        refreshToken.token = crypto
          .randomBytes(this.refreshTokenBytes)
          .toString('hex');
        refreshToken.user = user;
        await refreshToken.save();
        saved = true;
      } catch (err) {
        if (
          err.detail &&
          err.detail.includes('(token)') &&
          err.detail.includes('already exists')
        ) {
          // try again
        } else {
          throw err;
        }
      }
    }
    return refreshToken;
  }

  private async validateRefreshToken(token: string) {
    // TODO: check if blacklisted etc
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    console.log('refreshToken', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return refreshToken;
  }
}
