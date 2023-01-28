import { Department, Organization, Role } from '@prisma/client';
interface JwtUser {
  username: string;
  role: Role;
  department: Department;
  organization: Organization;
}
export default JwtUser;
