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
    public sendMessage(client: Socket, payload: IMessagePayload): void {
      const recipient = this._clients.find(client => client.userId === payload.recipientId);
      this.messengerService.saveMessage(payload);
      recipient.socket.send('send:message:response', {
        ...payload
      });
    }

    @UseGuards(JwtAuthGuard)
    @SubscribeMessage('get:message:request')
    public getAllMessages(client: Socket, chatId: number): void {
      client.send('get:message:response', {
        result: this.messengerService.getAllMessages(chatId)
      })
    }

    public afterInit(server: Server) {
      console.log('Init');
    }

    public handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);   
    }

    @UseGuards(JwtAuthGuard)
    public handleConnection(client: Socket, ...args: any[]) {      
      console.log(`Client connected: ${client.id}`);
      console.log(client.handshake.query.userId);
      this._clients.push({
        userId: Number(client.handshake.query['userId']),
        socket: client
      });
    }
}

export interface IMessagePayload {
  senderId: number,
  recipientId: number,
  date: Date,
  text: string
}

export interface IClient {
  userId: number,
  socket: Socket
}