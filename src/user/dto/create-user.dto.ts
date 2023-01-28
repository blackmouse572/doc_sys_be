import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  phoneNumber: string;
  @IsString()
  fullName: string;
}
