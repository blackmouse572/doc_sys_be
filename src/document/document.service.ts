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
      const { dateExpired, dateRelease, dataAvailable } = createDocumentDto;

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
      const user = await this.prisma.user.findUnique({
        where: {
          username: userId,
        },
      });
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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
        },
      });
      return documents;
    } catch (e) {
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
          DocumentReceiveDetail: {
            //Get user inside the document receive detail list
            distinct: ['userId'],
            select: {
              user: {
                select: {
                  username: true,
                  avatar: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      //If user is not inside the document receive detail list => return null
      if (
        document.DocumentReceiveDetail &&
        document.DocumentReceiveDetail.length > 0
      ) {
        //Check if user is inside the document receive detail list
        const isExist =
          document.DocumentReceiveDetail.some(
            (item) => item.user.username === username,
          ) || document.user.username === username;
        console.log(
          'Document receive detail: ',
          document.DocumentReceiveDetail,
        );

        if (!isExist) {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND, {
            cause: new Error('Not found'),
          });
        }
        return document;
      }
      throw new HttpException('Not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Not found'),
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error as string,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
    filter: Prisma.DocumentFindManyArgs,
    queryString: string,
    own: boolean,
    username: string,
  ) {
    try {
      //Modify filter to make sure that get all document that user can see (own document or document that user is in the receive list)

      filter.where = {
        ...filter.where,
        OR: [
          {
            user: {
              username: own ? username : undefined,
            },
          },
          {
            DocumentReceiveDetail: {
              some: {
                user: {
                  username: own ? username : undefined,
                },
              },
            },
          },
        ],
        AND: [
          {
            OR: [
              {
                content: {
                  contains: queryString,
                },
              },
              {
                description: {
                  contains: queryString,
                },
              },
            ],
          },
        ],
      };

      const documents = await this.prisma.document.findMany({
        ...filter,
        include: {
          user: true,
        },
      });

      return documents;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
