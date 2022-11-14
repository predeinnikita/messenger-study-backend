import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessengerService } from './messenger.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private _clients: IClient[] = [];

    constructor(
      private messengerService: MessengerService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @SubscribeMessage('send:message:request')
    public async sendMessage(client: Socket, payload: IMessagePayload): Promise<void> {
      console.log(payload);
      
      const recipient = this._clients.find(client => client.userId === payload.recipientId);
      const message = await this.messengerService.saveMessage(payload);

      if (recipient) {
        console.log(recipient.userId);
        recipient.socket.emit('send:message:response', {
          message
        });
      }
      client.emit('send:message:response', {
        message
      });
    }

    @UseGuards(JwtAuthGuard)
    @SubscribeMessage('get:message:request')
    public async getAllMessages(client: Socket, payload: any): Promise<void> {
      console.log(payload.chatId);
      
      const messages = await this.messengerService.getAllMessages(payload.chatId);
      client.emit('get:message:response', {
        result: messages.length > 0? messages: []
      })
    }

    public afterInit(server: Server) {
      console.log('Init');
    }

    public handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this._clients.splice(Number(client.handshake.query['userId']), 1)
    }

    @UseGuards(JwtAuthGuard)
    public handleConnection(client: Socket, ...args: any[]) {      
      console.log(`Client connected: ${client.id}`);
      // console.log(client.handshake.query);
      this._clients.push({
        userId: Number(client.handshake.query['userId']),
        socket: client
      });
    }
}

export interface IMessagePayload {
  senderId: number,
  recipientId: number,
  text: string
}

export interface IClient {
  userId: number,
  socket: Socket
}