import { IsDate, IsOptional, IsString } from 'class-validator';

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

  @IsDate()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  CID: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  currentAddress: string;

  @IsString()
  @IsOptional()
  groups: string;

  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  role: string;
}
