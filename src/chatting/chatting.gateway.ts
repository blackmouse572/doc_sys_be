import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AddUserToRoom } from 'src/room/dto/joint-room.dto';
import { RoomService } from 'src/room/room.service';
import JwtUser from 'src/user/entities/jwt-user.entity';
import { ChattingService } from './chatting.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ClientToServerEvents, ServerToClientEvents } from './dto/socket';

@WebSocketGateway()
export class ChattingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chattingService: ChattingService,
    private readonly roomService: RoomService,
  ) {
    this.logger = new Logger(ChattingGateway.name);
  }
  afterInit(server: any) {
    this.logger.log('Chat channel initialized');
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket & JwtUser): void {
    this.logger.log(
      `Client connected: ${client.id} with username: ${client.username}
      `,
    );
  }

  private readonly logger: Logger;
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  extractUser(client: Socket & JwtUser) {
    return {
      username: client.username,
      email: client.email,
      role: client.role,
      department: client.department,
      organization: client.organization,
      fullName: client.fullName,
    };
  }

  @SubscribeMessage('send')
  async create(
    @MessageBody() sendMessage: SendMessageDto,
    @ConnectedSocket() client: Socket & JwtUser,
  ) {
    const user = this.extractUser(client);

    //Save message
    const msg = await this.chattingService.create(sendMessage, user.username);
    this.logger.debug(
      `User ${user.username} sent message to room ${sendMessage.roomId}: ${msg.content}`,
    );
    this.server.to(sendMessage.roomId).emit('message', {
      message: msg,
    });
  }

  @SubscribeMessage('kick')
  async kick(
    @MessageBody()
    kickData: {
      roomId: string;
      users: Pick<User, 'fullName' | 'username' | 'avatar' | 'email'>[];
    },
    @ConnectedSocket() client: Socket & JwtUser,
  ) {
    const currentUser = this.extractUser(client);
    console.log(kickData);

    //Api was called, this is just for notification
    const kickedUserFullname =
      kickData.users.length > 1
        ? kickData.users.map((user) => user.fullName).join(' ,')
        : kickData.users[0].fullName;

    await this.chattingService.createServerMessage(
      kickData.roomId,
      `${kickedUserFullname} đã bị xoá bởi ${currentUser.username}`,
    );
    this.logger.debug(`${currentUser.username} kicked ${kickedUserFullname}`);
    //Send message to room
    this.server.to(kickData.roomId).emit('memberKicked', {
      users: kickData.users,
      admin: currentUser,
    });
  }

  @SubscribeMessage('addMembers')
  async addMembers(
    @MessageBody() addData: AddUserToRoom,
    @ConnectedSocket() client: Socket & JwtUser,
  ) {
    const currentUser = this.extractUser(client);
    const room = await this.roomService.addUserToRoom(
      addData,
      currentUser.username,
      addData.roomId,
    );

    //Get user info to send to room
    const userAdded = addData.userEmails.map((email) => {
      return room.members.find((member) => member.email === email);
    });
    this.logger.debug(
      `${currentUser.username}${userAdded.length} members to room ${room.id}`,
    );
    const addUserFullname = userAdded.map((user) => user.fullName).join(' ,');
    await this.chattingService.createServerMessage(
      addData.roomId,
      `${addUserFullname} được thêm vào bởi ${currentUser.username}`,
    );
    //Send message to room
    this.server.to(room.id).emit('memberAdded', {
      users: [...userAdded],
      admin: currentUser,
    });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket & JwtUser,
  ) {
    this.logger.debug(`User(${client.fullName} joined room: ${roomId})`);
    //Check if user is in room
    const room = await this.roomService.findOne(roomId, client.username);

    if (!room) {
      this.logger.error(
        `User(${client.username}) try to join room(${roomId}) but not a member`,
      );
      return;
    }

    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const leaveData = await this.roomService.leaveRoom(roomId, client.id);
    await this.chattingService.createServerMessage(
      roomId,
      `${leaveData.user.fullName} đã rời khỏi phòng`,
    );
    client.leave(roomId);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(roomId).emit('typing');
  }

  @SubscribeMessage('stopTyping')
  async stopTyping(
    @MessageBody() roomId: string,
    @ConnectedSocket()
    client: Socket,
  ) {
    client.to(roomId).emit('stopTyping');
  }
}
