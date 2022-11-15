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
      const recipient = this._clients.find(client => client.userId === payload.recipientId);
      const message = await this.messengerService.saveMessage(payload);

      if (recipient) {
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
      const messages = await this.messengerService.getAllMessages(payload.chatId);
      client.emit('get:message:response', {
        result: messages.length > 0? messages: []
      })
    }

    public afterInit(server: Server) {
      console.log('Init');
    }

    public handleDisconnect(socket: Socket) {
      const userId = Number(socket.handshake.query['userId']);
      this._clients = this._clients.filter(client => client.userId !== userId)
    }

    @UseGuards(JwtAuthGuard)
    public handleConnection(client: Socket, ...args: any[]) {   
      console.log(`Client connected: ${client.id}`);
      const userId = Number(client.handshake.query['userId']);
      const connectedClient = this._clients.find(client => client.userId === userId);
      if (connectedClient) {
        connectedClient.socket = client;
      } else {
        this._clients.push({
          userId: userId,
          socket: client
        });
      }
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