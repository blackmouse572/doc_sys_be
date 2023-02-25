import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepartmentService } from 'src/department/department.service';
import { OrganizationService } from 'src/organization/organization.service';
import { PrismaService } from 'src/prisma/prsima.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { doc } from 'prettier';
import { DocumentReceiveDetail } from './entities/document.entity';

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
      const user = await this.prisma.user.findUnique({
        where:{
          username
        }, include: {
          User_Group:true
        }
      })

      const documents = await this.prisma.document.findMany({
        ...temp,
        where: {
          user: {
            username: own ? username : undefined,
          }
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
          DocumentReceiveDetail :{
            select: {
              id: true,
              userId: true
            }
          }
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
          DocumentReceiveDetail : true,
          DocumentReceiveGroup : true,
        },
      });
      const user = await this.prisma.user.findUnique({
         where: {
           username 
          },
          include:{
            User_Group : true
          }
         });
          console.log(document);
          
      if (document.user.username === username) {
        return document;
      }
      else if(document.DocumentReceiveDetail.find(doc => doc.userId === user.id)) {
        return document;
      }
      else if(document.DocumentReceiveGroup.find(doc => user.User_Group.find(g => g.groupId === doc.groupId)))
     {
      return document;
      }else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      
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
      const document = await this.prisma.document.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
      if (!document) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }else if (document.user.username!== username) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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

  async remove(username: string, id: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
      if (!document) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }else if(document.user.username!== username) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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
        where: {
          OR: [
            {
              user: {
                username: username
              }
            },
            {
              DocumentReceiveDetail: {
                some: {
                  user: {
                    username: username
                  }
                }
              }
            },
            {
              DocumentReceiveGroup: {
                some: {
                  group: {
                    User_Group: {
                      some: {
                        user: {
                          username : username
                        }
                      }
                    }
                  }
                }
              }
            }
          ]
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
