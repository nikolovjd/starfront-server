import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserRequestDto {
  @ApiModelProperty()
  @IsEmail()
  @Transform(value => value.toLowerCase())
  email: string;

  @ApiModelProperty()
  @IsString()
  password: string;
}
