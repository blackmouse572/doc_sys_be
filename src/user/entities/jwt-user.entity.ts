import { Department, Organization, Role } from '@prisma/client';
interface JwtUser {
  username: string;
  fullName: string;
  role: Role;
  email: string;
  department: Department;
  organization: Organization;
}
export default JwtUser;
