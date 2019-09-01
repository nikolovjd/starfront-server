import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmailConfirmationTokenException extends HttpException {
  constructor() {
    super('invalid email confirmation token', HttpStatus.NOT_FOUND);
  }
}
