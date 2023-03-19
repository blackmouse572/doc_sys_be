import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prsima.service';
import { GeneratedFindOptions } from 'src/shared';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddUserToRoom } from './dto/joint-room.dto';
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
          avatar: avatar || '',
          name: name,
          members: {
            connect: membersEmail.map((email) => ({ email })),
          },
          adminMembers: {
            connect: {
              email: email,
            },
          },
        },
      });
      return newRoom;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(username: string, filter: Prisma.RoomFindManyArgs) {
    try {
      filter.where = {
        OR: [
          {
            members: {
              some: {
                username: username,
              },
            },
          },
          {
            adminMembers: {
              some: {
                username: username,
              },
            },
          },
        ],
      };

      const rooms = await this.prisma.room.findMany({
        ...filter,
      });

      return {
        rooms,
        metadata: {
          total: rooms.length,
          limit: filter.take,
          offset: filter.skip,
        },
      };
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'P2002':
          throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async findOne(id: string, username: string) {
    try {
      //Find room
      const room = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
        select: {
          members: {
            select: {
              username: true,
              avatar: true,
              email: true,
            },
          },
          adminMembers: {
            select: {
              username: true,
              avatar: true,
              email: true,
            },
          },
        },
      });

      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      if (
        room.members.some((user) => user.username === username) ||
        room.adminMembers.some((user) => user.username === username)
      ) {
        return room;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'P2002':
          throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, username: string) {
    try {
      //Check if current user is admin of the room
      const room = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
        select: {
          adminMembers: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!room.adminMembers.some((user) => user.username === username)) {
        throw new HttpException(
          'You are not admin of this room',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Update room
      const { name, avatar } = updateRoomDto;
      const updatedRoom = await this.prisma.room.update({
        where: {
          id: id,
        },
        data: {
          avatar: avatar || '',
          name: name,
        },
      });

      return updatedRoom;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'P2002':
          throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async addUserToRoom(addUserToRoom: AddUserToRoom, username: string) {
    try {
      const { roomId, users } = addUserToRoom;
      //Check if current user is admin of the room
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          adminMembers: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!room.adminMembers.some((user) => user.username === username)) {
        throw new HttpException(
          'You are not admin of this room',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Add new users to room, keep old users
      const updatedRoom = await this.prisma.room.update({
        where: {
          id: roomId,
        },
        data: {
          members: {
            connect: users.map((user) => ({ username: user })),
          },
        },
      });

      return updatedRoom;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'P2002':
          throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async removeUserFromRoom(addUser: AddUserToRoom, username: string) {
    //Check if current user is admin of the room
    const room = await this.prisma.room.findUnique({
      where: {
        id: addUser.roomId,
      },
      select: {
        adminMembers: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!room.adminMembers.some((user) => user.username === username)) {
      throw new HttpException(
        'You are not admin of this room',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Remove users from room
    const updatedRoom = await this.prisma.room.update({
      where: {
        id: addUser.roomId,
      },
      data: {
        members: {
          disconnect: addUser.users.map((user) => ({ username: user })),
        },
      },
    });

    return updatedRoom;
  }

  async leaveRoom(roomId: string, username: string) {
    //check if user is in room
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        members: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!room.members.some((user) => user.username === username)) {
      throw new HttpException(
        'You are not in this room',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Remove user from room
    const updatedRoom = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          disconnect: [{ username: username }],
        },
      },
    });

    return {
      message: 'Leave room successfully',
      updatedRoom,
    };
  }

  async getRoomMessages(
    id: string,
    findOptions: GeneratedFindOptions<Prisma.MessageWhereInput>,
    username: string,
  ) {
    //Check if user is in room
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
      },
      select: {
        members: {
          select: {
            username: true,
          },
        },
        name: true,
        createdAt: true,
      },
    });

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    if (!room.members.some((user) => user.username === username)) {
      throw new HttpException(
        'You are not in this room',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Get room messages
    findOptions.take = findOptions.take || 10;
    findOptions.where = {
      ...findOptions.where,
      Room: {
        id: id,
      },
    };

    const messages = await this.prisma.message.findMany({
      ...findOptions,
      select: {
        sender: {
          select: {
            username: true,
            avatar: true,
            fullName: true,
            email: true,
          },
        },
        content: true,
        createdAt: true,
        updatedAt: true,
        id: true,
      },
      orderBy: {
        ...findOptions.orderBy,
        createdAt: 'desc',
      },
    });

    return {
      messages,
      metadata: {
        total: messages.length,
        limit: findOptions.take,
        offset: findOptions.skip || 0,
        room: room,
      },
    };
  }
}
