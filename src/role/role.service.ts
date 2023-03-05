import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prsima.service';
import { RoleSeed } from 'src/seed/entity/seed.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.prisma.role.create({
        data: {
          ...createRoleDto,
        },
      });
      return role;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all role`;
  }

  async findOne(id: string) {
    const _role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    return _role;
  }

  async findByName(name: string) {
    const _role = await this.prisma.role.findUnique({
      where: {
        name,
      },
    });

    return _role;
  }

  async findEach(roles: string[]) {
    //Find all roles, throw error if any role is not found
    const _roles = await this.prisma.role.findMany({
      where: {
        name: {
          in: roles,
        },
      },
    });

    return _roles;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  findOrCreate(roleName: string) {
    this.prisma.role.upsert({
      where: {
        name: roleName,
      },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  async createMany(roles: string[] | RoleSeed[]) {
    const _roles = await this.prisma.role.createMany({
      skipDuplicates: true,
      data: roles.map((role) => {
        return {
          name: typeof role === 'string' ? role : role.name,
        };
      }),
    });

    return _roles;
  }
}
