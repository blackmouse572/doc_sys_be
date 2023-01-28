import { Group } from '@prisma/client';
import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto implements Partial<Group> {
  @IsString()
  name: string;
  @IsNumber()
  @IsEmpty()
  level?: number;
}
