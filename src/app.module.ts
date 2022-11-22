import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

const registerTypeOrmModule = async (configService: ConfigService) => ({
  type: configService.get('TYPE_ORM'),
  host: configService.get('HOST_ORM'),
  port: configService.get('PORT_ORM'),
  username: configService.get('USERNAME_ORM'),
  password: configService.get('PASSWORD_ORM'),
  database: configService.get('DATABASE_ORM'),
  entities: [UserEntity, ChatEntity, MessageEntity],
  synchronize: true,
});

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatsModule,
    MessengerModule,
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true, }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: registerTypeOrmModule,
      inject: [ ConfigService ]
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
