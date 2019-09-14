import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccessTokenRequestDto {
  @ApiModelPropertyOptional()
  @IsString()
  refreshToken: string;
}
