import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prsima.service';
import { GroupSeed } from 'src/seed/entity/seed.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGroupDto: CreateGroupDto) {
    try {
      const group = await this.prisma.group.create({
        data: {
          ...createGroupDto,
        },
      });
      return group;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createMany(groups: GroupSeed[]) {
    const _groups = await this.prisma.group.createMany({
      skipDuplicates: true,
      data: groups.map((group) => {
        return {
          name: group.name,
        };
      }),
    });

    return _groups;
  }

  async findAll(filter?: Prisma.GroupFindManyArgs) {
    try {
      const groups = await this.prisma.group.findMany(filter);

      return groups;
    } catch (error) {}
  }
  async findOne(id: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: {
          id,
        },
      });

      return group;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findEach(ids: string[]) {
    try {
      const groups = await this.prisma.group.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return groups;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name: string) {
    try {
      const group = await this.prisma.group.findUnique({
        where: {
          name,
        },
      });

      return group;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
