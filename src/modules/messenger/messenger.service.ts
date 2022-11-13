import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../entities/message.entity';
import { UsersService } from '../users/users.service';
import { IMessagePayload } from './websocket.gateway';

@Injectable()
export class MessengerService {

  constructor(
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private usersService: UsersService
  ) {
  }

  public async saveMessage(payload: IMessagePayload): Promise<void> {
    const sender = await this.usersService.findById(payload.senderId);
    const recipient = await this.usersService.findById(payload.recipientId);
    const message = new MessageEntity();
    message.sender = sender;
    message.recipient = recipient;
    message.text = payload.text;
    message.date = new Date();
    message.save();
  }

  public async getAllMessages(chatId: number): Promise<MessageEntity[]> {
    return await this.messagesRepository.find({ 
      where: [
        {
          id: chatId
        }
      ]
    })
  }

}
