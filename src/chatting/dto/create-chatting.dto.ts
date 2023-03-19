import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChattingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
