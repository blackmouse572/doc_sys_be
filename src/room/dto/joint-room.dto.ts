import { IsString } from 'class-validator';
import { BaseUserRoomDto } from './base-user-room.dto';

export class AddUserToRoom extends BaseUserRoomDto {
  @IsString()
  roomId: string;
}
