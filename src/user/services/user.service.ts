import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequestDto } from '../dto/request/create-user-request.dto';
import { Password } from '../models/password.entity';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { EmailConfirmationToken } from '../models/email-confirmation-token.entity';
import { InvalidEmailConfirmationTokenException } from '../exceptions/invalid-email-confirmation-token.exception';
import { EmailAlreadyConfirmedException } from '../exceptions/email-already-confirmed.exception';
import { EmailConfirmationTokenAlreadyUsedException } from '../exceptions/email-confirmation-token-already-used.exception';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(EmailConfirmationToken)
    private readonly emailConfirmationTokenRepository: Repository<
      EmailConfirmationToken
    >,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async createUser(data: CreateUserRequestDto) {
    // User
    const user = this.userRepository.create();
    user.email = data.email;

    // Password
    const password = this.passwordRepository.create();
    password.hash = await this.authService.hashPassword(data.password);

    try {
      await getConnection().transaction(async t => {
        await t.save(user);
        password.user = user;
        await t.save(password);
      });
    } catch (err) {
      if (
        err.detail &&
        err.detail.includes('(email)') &&
        err.detail.includes('already exists')
      ) {
        throw new EmailAlreadyExistsException();
      } else {
        throw err;
      }
    }

    let emailTokenSet = false;

    while (!emailTokenSet) {
      try {
        // Email Confirmation Token
        const token = this.emailConfirmationTokenRepository.create();
        token.token = this.authService.generateEmailConfirmationToken();
        token.user = user;
        await token.save();
        emailTokenSet = true;
      } catch (err) {
        if (
          err.detail &&
          err.detail.includes('(token)') &&
          err.detail.includes('already exists')
        ) {
          // Continue loop
        } else {
          throw err;
        }
      }
    }
  }

  public async confirmEmail(token: string) {
    const confirmationToken = await this.emailConfirmationTokenRepository.findOne(
      { where: { token }, relations: ['user'] },
    );

    if (!confirmationToken) {
      throw new InvalidEmailConfirmationTokenException();
    }

    const user = confirmationToken.user;

    if (user.emailConfirmed) {
      throw new EmailAlreadyConfirmedException();
    }

    if (confirmationToken.usedAt) {
      throw new EmailConfirmationTokenAlreadyUsedException();
    }

    user.emailConfirmed = true;
    confirmationToken.usedAt = new Date();

    getConnection().transaction(async t => {
      await t.save(confirmationToken);
      await t.save(user);
    });
  }

  public async findByEmail(email: string, relations?: string[]) {
    return this.userRepository.findOne({ where: { email }, relations });
  }
}
