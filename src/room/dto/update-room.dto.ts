import { IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
