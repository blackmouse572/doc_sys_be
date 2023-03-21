import { IsArray } from 'class-validator';

export class BaseUserRoomDto {
  @IsArray()
  userEmails: string[];
}
