import { Group } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreateGroupDto implements Partial<Group> {
  @IsString()
  name: string;
  @IsNumber()
  level?: number;
}
