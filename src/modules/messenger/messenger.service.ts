import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../entities/message.entity';
import { ChatsService } from '../chats/chats.service';
import { UsersService } from '../users/users.service';
import { IMessagePayload } from './websocket.gateway';

@Injectable()
export class MessengerService {

  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private usersService: UsersService,
    private chatsService: ChatsService,
  ) {
  }

  public async saveMessage(payload: IMessagePayload): Promise<MessageEntity> {
    const sender = await this.usersService.findById(payload.senderId);
    const recipient = await this.usersService.findById(payload.recipientId);
    const chat = await this.chatsService.getChatBetweenUsers(sender, recipient);
    const message = new MessageEntity();
    message.chat = chat;
    message.sender = sender;
    message.recipient = recipient;
    message.text = payload.text;
    message.date = new Date();

    return message.save();
  }

  public async getLastMessage(chatId: number): Promise<MessageEntity> {
    const lastMessage = await this.messagesRepository.find({
      where: [
        {
          chat: {
            id: chatId
          }
        }
      ],
      take: 1
    })

    if (lastMessage.length === 0) {
      return lastMessage[0];
    }

    throw new InternalServerErrorException();
  }

  public async getAllMessages(chatId: number): Promise<MessageEntity[]> {
    const messages =  await this.messagesRepository.find({ 
      where: [
        {
          chat: {
            id: chatId
          }
        }
      ],
      relations: {
        sender: true,
        chat: true,
      },
      order: {
        date: {
          direction: 'DESC'
        }
      }
    });

    return messages;
  }

}
