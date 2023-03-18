import { IsArray, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  avatar?: string;

  @IsArray({
    each: true,
  })
  membersEmail: string[];
}
