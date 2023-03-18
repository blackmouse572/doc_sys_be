import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddUserToRoom {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsArray()
  @IsNotEmpty()
  users: string[];
}
