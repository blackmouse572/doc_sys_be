import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prsima.service';
import { RoomService } from 'src/room/room.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';

@Injectable()
export class ChattingService {
  constructor(
    private readonly roomService: RoomService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createChattingDto: SendMessageDto, username: string) {
    //Save message
    if (!createChattingDto.content) throw new Error('Message is empty');
    if (!createChattingDto.roomId) throw new Error('RoomId is empty');

    //Check if room exist
    const room = await this.roomService.findOne(
      createChattingDto.roomId,
      username,
    );
    if (!room) throw new Error('Room not found');

    //Save message
    const msg = await this.prisma.message.create({
      data: {
        content: createChattingDto.content,
        Room: {
          connect: {
            id: createChattingDto.roomId,
          },
        },
        sender: {
          connect: {
            username: username,
          },
        },
      },
    });

    return msg;
  }

  async createServerMessage(roomId: string, content: string) {
    const msg = await this.prisma.message.create({
      data: {
        content: content,
        Room: {
          connect: {
            id: roomId,
          },
        },
        sender: {
          connect: {
            username: 'system',
          },
        },
      },
    });

    return msg;
  }

  findAll() {
    return `This action returns all chatting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatting`;
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
