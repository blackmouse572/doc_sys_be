import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class UserSeed extends CreateUserDto {
  role: string;
  department: string;
  group: string;
  groups: string;
}

export class RoleSeed {
  name: string;
}

export class DepartmentSeed {
  name: string;
}

export class GroupSeed {
  name: string;
  level: number;
}

export class OrganizationSeed {
  name: string;
}
