import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Message, Prisma, Room } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DirectFilterPipe, FilterDto } from 'src/shared';
import { CreateRoomDto } from './dto/create-room.dto';
import { AddUserToRoom } from './dto/joint-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UserAssignDto } from './dto/user-assigned.dto';
import { RoomService } from './room.service';

@Controller('room')
@UseGuards(JwtGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    const { email } = req.user;
    return this.roomService.create(createRoomDto, email);
  }

  @Get()
  findAll(
    @Request() req,
    @Query(
      new DirectFilterPipe<Room, Prisma.RoomWhereInput>(
        ['name'],
        ['membersEmail'],
      ),
    )
    filter: FilterDto<Prisma.RoomWhereInput>,
  ) {
    const { username } = req.user;
    return this.roomService.findAll(username, filter.findOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.roomService.findOne(id, username);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Request() req,
  ) {
    const { username } = req.user;
    return this.roomService.update(id, updateRoomDto, username);
  }

  @Post(':id/add')
  addUserToRoom(
    @Param('id') id: string,
    @Request() req,
    @Body() addUser: AddUserToRoom,
  ) {
    const { username } = req.user;

    return this.roomService.addUserToRoom(addUser, username, id);
  }

  @Post(':id/assign')
  assignAdmin(
    @Param('id') id: string,
    @Request() req,
    @Body() usersAssigned: UserAssignDto,
  ) {
    const { username } = req.user;

    return this.roomService.assignAdmin(usersAssigned, username, id);
  }

  @Post(':id/assign-remove')
  removeAdmin(
    @Param('id') id: string,
    @Request() req,
    @Body() usersAssigned: UserAssignDto,
  ) {
    const { username } = req.user;

    return this.roomService.removeAdmin(usersAssigned, username, id);
  }

  @Post(':id/kick')
  removeUserFromRoom(
    @Param('id') id: string,
    @Request() req,
    @Body() addUser: AddUserToRoom,
  ) {
    const { username } = req.user;

    return this.roomService.removeUserFromRoom(addUser, username, id);
  }

  @Post(':id/leave')
  leaveRoom(@Param('id') id: string, @Request() req) {
    const { username } = req.user;

    return this.roomService.leaveRoom(id, username);
  }

  @Get(':id/messages')
  getRoomMessages(
    @Param('id') id: string,
    @Request() req,
    @Query(
      new DirectFilterPipe<Message, Prisma.MessageWhereInput>(
        ['content'],
        ['membersEmail'],
      ),
    )
    filter: FilterDto<Prisma.MessageWhereInput>,
  ) {
    const { username } = req.user;
    return this.roomService.getRoomMessages(id, filter.findOptions, username);
  }
}
