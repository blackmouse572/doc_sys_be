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
import { Server, Socket } from 'socket.io';
import { AddUserToRoom } from 'src/room/dto/joint-room.dto';
import { RoomService } from 'src/room/room.service';
import JwtUser from 'src/user/entities/jwt-user.entity';
import { ChattingService } from './chatting.service';
import { SendMessageDto } from './dto/send-message.dto';

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
  handleConnection(client: Socket & JwtUser, ...args: any[]): void {
    this.logger.log(
      `Client connected: ${client.id} with username: ${client.username}
      `,
    );
  }
  private readonly logger: Logger;
  @WebSocketServer()
  server: Server;
  extractUser(client: Socket & JwtUser) {
    return {
      username: client.username,
      email: client.email,
      role: client.role,
      department: client.department,
      organization: client.organization,
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

  @SubscribeMessage('addMember')
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

    //Send message to room
    this.server.to(room.id).emit('memberAdded', {
      username: currentUser.username,
      users: addData.userEmails,
    });
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket & JwtUser,
  ) {
    this.logger.debug(`User(${client.username} joined room: ${roomId})`);
    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
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
