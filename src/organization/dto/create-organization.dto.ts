import { Organization } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateOrganizationDto implements Partial<Organization> {
  @IsString()
  name: string;
}
