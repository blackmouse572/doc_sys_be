import { Role } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateRoleDto implements Partial<Role> {
  @IsString()
  name: string;
}
