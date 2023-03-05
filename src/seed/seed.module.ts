import { Module } from '@nestjs/common';
import { DepartmentModule } from 'src/department/department.module';
import { GroupModule } from 'src/group/group.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    UserModule,
    DepartmentModule,
    GroupModule,
    RoleModule,
    PrismaModule,
    OrganizationModule,
  ],
})
export class SeedModule {}
