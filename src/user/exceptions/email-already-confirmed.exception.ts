import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyConfirmedException extends HttpException {
  constructor() {
    super('email already confirmed', HttpStatus.CONFLICT);
  }
}
