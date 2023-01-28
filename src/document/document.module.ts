import { Module } from '@nestjs/common';
import { DepartmentModule } from 'src/department/department.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [PrismaModule, OrganizationModule, DepartmentModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
