import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRequestDto {
  @ApiModelProperty()
  @IsString()
  @Transform(value => value.toLowerCase())
  email: string;

  @ApiModelProperty()
  @IsString()
  password: string;

  @ApiModelPropertyOptional()
  @IsBoolean()
  cookie: boolean = false;
}
