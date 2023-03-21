import { IsArray } from 'class-validator';

export class UserAssignDto {
  @IsArray()
  userEmails: string[];
}
