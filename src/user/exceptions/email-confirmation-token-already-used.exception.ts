import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailConfirmationTokenAlreadyUsedException extends HttpException {
  constructor() {
    super('email confirmation token already used', HttpStatus.CONFLICT);
  }
}
