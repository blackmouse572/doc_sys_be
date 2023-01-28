import { Department } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateDepartmentDto implements Partial<Department> {
  @IsString()
  name: string;
}
