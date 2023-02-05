import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepartmentService } from 'src/department/department.service';
import { OrganizationService } from 'src/organization/organization.service';
import { PrismaService } from 'src/prisma/prsima.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
    private readonly departmentService: DepartmentService,
  ) {}
  async create(createDocumentDto: CreateDocumentDto, userId: string) {
    try {
      const {
        dateExpired,
        dateRelease,
        dataAvailable,
        sentDepartment,
        sentOrganization,
      } = createDocumentDto;

      //Check date valid
      if (dateExpired < dateRelease) {
        throw new HttpException(
          'Date expired must be greater than date release',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (dataAvailable < dateRelease) {
        throw new HttpException(
          'Date available must be greater than date release',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (dateExpired < dataAvailable) {
        throw new HttpException(
          'Date expired must be greater than date available',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Check sentDepartment and sentOrganization
      const department = await this.departmentService.findOne(sentDepartment);
      const organization = await this.organizationService.findOne(
        sentOrganization,
      );
      const role = await this.prisma.role.findUnique({
        where: {
          id: createDocumentDto.issueRoleId,
        },
      });
      const group = await this.prisma.group.findUnique({
        where: {
          id: createDocumentDto.issueGroupId,
        },
      });
      const user = await this.prisma.user.findUnique({
        where: {
          username: userId,
        },
      });
      if (!department || !organization) {
        throw new HttpException(
          'Department or Organization not found',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!group) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      const document = this.prisma.document.create({
        data: {
          ...createDocumentDto,
          issuePublisherId: user.id,
        },
      });
      return document;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* Calling the findAll method in the documentService.ts file. */
  async findAll(
    username: string,
    filter: Prisma.DocumentFindManyArgs,
    own?: boolean,
  ) {
    try {
      const temp = filter;
      temp.where = {
        ...filter.where,
      };

      const documents = await this.prisma.document.findMany({
        ...temp,
        where: {
          user: {
            username: own ? username : undefined,
          },
        },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              avatar: true,
              fullName: true,
            },
          },
          Department: true,
          Organization: true,
        },
      });
      return documents;
    } catch (e) {
      console.log(e);

      throw new HttpException('message', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: new Error(e),
      });
    }
  }

  async findOne(username: string, id: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
      if (document.user.username !== username) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    username: string,
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    try {
      const document = this.findOne(username, id);
      if (!document) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const updatedDocument = await this.prisma.document.update({
        where: {
          id,
        },
        data: {
          ...updateDocumentDto,
        },
      });
      return updatedDocument;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(username: string, id: string) {
    try {
      const document = this.findOne(username, id);
      if (!document) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const deletedDocument = this.prisma.document.delete({
        where: {
          id,
        },
      });
      return deletedDocument;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMany(
    queryString: string,
    filter: Prisma.DocumentFindManyArgs,
    own: boolean,
    username: string,
  ) {
    try {
      const documents = await this.prisma.document.findMany({
        ...filter,
        where: {
          user: {
            username: own ? username : undefined,
          },
          OR: [
            {
              description: {
                contains: queryString,
              },
            },
            {
              content: {
                contains: queryString,
              },
            },
            {},
          ],
        },
        orderBy: {
          dateRelease: 'desc',
        },
      });

      return documents;
    } catch (error) {
      console.log(error);

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
