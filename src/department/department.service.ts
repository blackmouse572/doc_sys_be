import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prsima.service';
import { DepartmentSeed } from 'src/seed/entity/seed.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.prisma.department.create({
        data: {
          ...createDepartmentDto,
        },
      });
      return department;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createMany(departments: DepartmentSeed[]) {
    const _departments = await this.prisma.department.createMany({
      skipDuplicates: true,
      data: departments.map((department) => {
        return {
          name: department.name,
        };
      }),
    });

    return _departments;
  }

  findAll() {
    return `This action returns all department`;
  }

  async findOne(id: string) {
    try {
      const department = await this.prisma.department.findUnique({
        where: {
          id,
        },
      });
      return department;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findEach(ids: string[]) {
    try {
      const departments = await this.prisma.department.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return departments;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name: string) {
    try {
      const department = await this.prisma.department.findUnique({
        where: {
          name,
        },
      });
      return department;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
