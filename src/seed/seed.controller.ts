import { Controller, HttpException, Post } from '@nestjs/common';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SeedService } from './seed.service';

@Controller()
@UseGuards(JwtGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('/seed-organization')
  async createOrganizationSeedData() {
    return this.seedService.createOrganization({ name: 'Organization 1' });
  }

  @Post('/seed-role')
  async createRoleSeedData() {
    const fileURL = './src/seed/ACCOUNT_TABLE_DOCSYS.xlsx';
    try {
      const result = await this.seedService.generateRoleData(fileURL);
      return result;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        //Case read excel file error
        case 'ENOENT':
          throw new HttpException('File not found', 404);
        //Case sheet not found
        case 'TypeError':
          throw new HttpException('Sheet not found', 404);
        case 'P2002':
        case HttpException:
          throw new HttpException('Duplicate data', 400);
        default:
          throw new HttpException(error, 500);
      }
    }
  }

  @Post('/seed-department')
  async createDepartmentSeedData() {
    const fileURL = './src/seed/ACCOUNT_TABLE_DOCSYS.xlsx';
    try {
      const result = await this.seedService.generateDepartmentData(fileURL);
      return result;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        //Case read excel file error
        case 'ENOENT':
          throw new HttpException('File not found', 404);
        //Case sheet not found
        case 'TypeError':
          throw new HttpException('Sheet not found', 404);
        case 'P2002':
        case HttpException:
          throw new HttpException('Duplicate data', 400);
        default:
          throw new HttpException(error, 500);
      }
    }
  }

  @Post('/seed-group')
  async createGroupSeedData() {
    const fileURL = './src/seed/ACCOUNT_TABLE_DOCSYS.xlsx';
    try {
      const result = await this.seedService.genrateGroupData(fileURL);
      return result;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        //Case read excel file error
        case 'ENOENT':
          throw new HttpException('File not found', 404);
        //Case sheet not found
        case 'TypeError':
          throw new HttpException('Sheet not found', 404);
        case 'P2002':
        case HttpException:
          throw new HttpException('Duplicate data', 400);
        default:
          throw new HttpException(error, 500);
      }
    }
  }

  @Post('/seed-user')
  async createSeedData(@Req() req: any) {
    const fileURL = './src/seed/ACCOUNT_TABLE_DOCSYS.xlsx';
    try {
      const result = await this.seedService.generateMembersData(
        fileURL,
        req.user.username,
      );
      return result;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        //Case read excel file error
        case 'ENOENT':
          throw new HttpException('File not found', 404);
        //Case sheet not found
        case 'TypeError':
          throw new HttpException('Sheet not found', 404);
        case 'P2002':
        case HttpException:
          throw new HttpException('Duplicate data', 400);
        default:
          throw new HttpException(error, 500);
      }
    }
  }
}
