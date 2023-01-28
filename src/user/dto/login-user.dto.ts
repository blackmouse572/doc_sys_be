import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @ApiProperty({
    example: 'test2',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'test2',
  })
  password: string;
}
