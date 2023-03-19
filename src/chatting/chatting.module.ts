import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { ChattingGateway } from './chatting.gateway';
import { ChattingService } from './chatting.service';

@Module({
  providers: [ChattingGateway, ChattingService],
  imports: [RoomModule, UserModule],
})
export class ChattingModule {}
