import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  //Array of emails (string)
  @IsArray()
  membersEmail: string[];
}
