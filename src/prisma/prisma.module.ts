import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prsima.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
