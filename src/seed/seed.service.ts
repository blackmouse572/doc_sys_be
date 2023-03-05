import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { DepartmentService } from 'src/department/department.service';
import { GroupService } from 'src/group/group.service';
import { OrganizationService } from 'src/organization/organization.service';
import { PrismaService } from 'src/prisma/prsima.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { readFile, utils as xlsxUtils } from 'xlsx';
import {
  DepartmentSeed,
  GroupSeed,
  RoleSeed,
  UserSeed,
} from './entity/seed.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userServices: UserService,
    private readonly departmentServices: DepartmentService,
    private readonly groupServices: GroupService,
    private readonly roleServices: RoleService,
    private readonly organizationServices: OrganizationService,
  ) {}

  async createWorkplace({
    username,
    roleName,
    departmentName,
    organizationId,
  }: {
    username: string;
    roleName: string;
    departmentName: string;
    organizationId: string;
  }) {
    try {
      const rs = await this.prisma.userWorkPlaceDetails.create({
        data: {
          department: {
            connect: {
              name: departmentName.trim(),
            },
          },
          user: {
            connect: {
              username,
            },
          },
          organization: {
            connect: {
              id: organizationId,
            },
          },
          role: {
            connect: {
              name: roleName,
            },
          },
        },
      });

      return rs;
    } catch (error) {
      throw new HttpException(
        {
          message: `Role name: ${roleName}, department name: ${departmentName}, organization id: ${organizationId} or username: ${username} does not exist`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createGroup({
    groupName,
    username,
  }: {
    groupName: string;
    username: string;
  }) {
    try {
      const rs = await this.prisma.user_Group.create({
        data: {
          user: {
            connect: {
              username,
            },
          },
          group: {
            connect: {
              name: groupName,
            },
          },
        },
      });

      return rs;
    } catch (error) {
      throw new HttpException(
        {
          message: `Group name: ${groupName} or username: ${username} does not exist`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Generate data from excel file. This is used for seeding data or importing data from excel file.
   *
   * Format of excel file:
   * - First row is the header inlude: username, email, password, firstName, lastName, dob, phoneNumber, role, department, group (note: group is a string, separate by comma)
   * - Header does not have to be in order and must be lowercase
   * - The rest of the rows are the data
   * - Must have 4 sheets: `members`, `roles`, `groups`, `departments` with the same order and format as above
   */

  async genrateGroupData(fileURL: string) {
    const workbook = readFile(fileURL);
    const groupSheets = workbook.Sheets['groups'];
    const groupData = xlsxUtils.sheet_to_json<GroupSeed>(groupSheets);
    const groups = await this.groupServices.createMany(groupData);
    return {
      status: 'success',
      message: 'Seed data successfully',
      metadata: {
        groups_uploaded: groups.count,
      },
    };
  }

  async generateDepartmentData(fileURL: string) {
    const workbook = readFile(fileURL);
    const departmentSheets = workbook.Sheets['departments'];
    const departmentData =
      xlsxUtils.sheet_to_json<DepartmentSeed>(departmentSheets);
    const departments = await this.departmentServices.createMany(
      departmentData,
    );
    return {
      status: 'success',
      message: 'Seed data successfully',
      metadata: {
        departments_uploaded: departments.count,
      },
    };
  }

  async generateRoleData(fileURL: string) {
    const workbook = readFile(fileURL);
    const roleSheets = workbook.Sheets['roles'];
    const roleData = xlsxUtils.sheet_to_json<RoleSeed>(roleSheets);
    const roles = await this.roleServices.createMany(roleData);
    return {
      status: 'success',
      message: 'Seed data successfully',
      metadata: {
        roles_uploaded: roles.count,
      },
    };
  }

  async generateMembersData(fileURL: string, username: string) {
    const userBase = await this.userServices.getUserFullInfo(username);
    const workbook = readFile(fileURL);
    const memberSheets = workbook.Sheets['members'];
    const userData = xlsxUtils.sheet_to_json<UserSeed>(memberSheets);

    const roleSet = new Set<string>();
    const departmentSet = new Set<string>();
    const groupSet = new Set<string>();

    userData.forEach((user) => {
      roleSet.add(user.role);
      departmentSet.add(user.department);
      user.groups.split(',').forEach((group) => {
        groupSet.add(group);
      });
    });

    const roleArr = Array.from(roleSet);
    const departmentArr = Array.from(departmentSet);
    const groupArr = Array.from(groupSet);

    //Get all groups, roles, departments
    const roles = await this.roleServices.findEach(roleArr);
    const departments = await this.departmentServices.findEach(departmentArr);
    const groups = await this.groupServices.findEach(groupArr);

    //Nested array of user
    const users: Prisma.UserCreateManyInput[] = userData.map((user) => {
      const groups = user.groups.split(',');
      return {
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        userWorkPlaceDetails: {
          create: {
            role: {
              connect: {
                name: user.role,
              },
            },
            department: {
              connect: {
                name: user.department,
              },
            },
            organization: {
              connect: {
                id: userBase.UserWorkPlaceDetails[0].organizationId,
              },
            },
          },
        },
        user_Groups: {
          create: groups.map((group) => {
            return {
              group: {
                connect: {
                  name: group,
                },
              },
            };
          }),
        },
      };
    });

    await this.userServices.createMany(users);

    return {
      status: 'success',
      message: 'Seed data successfully',

      metadata: {
        users_uploaded: users.length,
      },
    };
  }
}
