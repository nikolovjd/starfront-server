import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super('email already exists', HttpStatus.CONFLICT);
  }
}
