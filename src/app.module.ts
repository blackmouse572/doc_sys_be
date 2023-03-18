import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DepartmentModule } from './department/department.module';
import { DocumentModule } from './document/document.module';
import { GroupModule } from './group/group.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prsima.service';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DocumentModule,
    DepartmentModule,
    OrganizationModule,
    GroupModule,
    RoleModule,
    ChatModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
