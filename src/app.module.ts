import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { ChatsModule } from './modules/chats/chats.module';
import { MessengerModule } from './modules/messenger/messenger.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatsModule,
    MessengerModule,
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true, }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'messenger',
      entities: [UserEntity, ChatEntity, MessageEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
      AppService
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    
  }
}
