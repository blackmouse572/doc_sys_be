import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prsima.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto, email: string) {
    try {
      if (createRoomDto.membersEmail.length < 2) {
        throw new HttpException(
          'Members must be greater than 2',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Create room
      const { membersEmail, name, avatar } = createRoomDto;
      membersEmail.push(email); //Add user to members
      const newRoom = await this.prisma.room.create({
        data: {
          avatar: avatar,
          name: name,
          members: {
            connect: membersEmail.map((email) => {
              return { email: email };
            }),
          },
        },
      });
      return newRoom;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all room`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
