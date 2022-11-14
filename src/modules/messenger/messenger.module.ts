import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { ChatsModule } from '../chats/chats.module';
import { UsersModule } from '../users/users.module';
import { MessengerService } from './messenger.service';
import { AppGateway } from './websocket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), UsersModule, ChatsModule],
  controllers: [],
  providers: [MessengerService, AppGateway],
  exports: [MessengerService],
})
export class MessengerModule {}
