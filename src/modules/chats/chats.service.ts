import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/entities/chat.entity';
import { UserEntity } from 'src/entities/user.entity';
import ChatModel from 'src/models/chat.model';
import MessageModel from 'src/models/message.model';
import { Like, Repository } from 'typeorm';
import { MessengerService } from '../messenger/messenger.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatsService {

  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    private userService: UsersService,
  ) {
  }

  public async createChat(userId: number, otherUserId: number): Promise<void> {
    const firstUser = await this.userService.findById(userId);
    const secondUser = await this.userService.findById(otherUserId);
    if (userId == otherUserId) {
      throw new BadRequestException('Невозможно создать чат с самим собой!');
    }
    if (!firstUser || !secondUser) {
      throw new BadRequestException('Пользователь с таким id не найден!');
    }
    if (await this.chatBetweenUsersExists(firstUser, secondUser)) {
      throw new BadRequestException('Такой чат уже существует!');
    }

    this.chatsRepository.create(new ChatEntity());
    const chat = this.chatsRepository.create(new ChatEntity())
    chat.firstUser = firstUser;
    chat.secondUser = secondUser;

    this.chatsRepository.save(chat);
  }

  public async getChats(userId: number): Promise<ChatModel[]> {
    const chats = await this.chatsRepository.find({
      relations: {
        firstUser: {
        },
        secondUser: {
        },
        messages: {
        }
      },
      where: [
        {
          firstUser: {
            id: userId
          }
        },
        {
          secondUser: {
            id: userId
          }
        }
      ],
    });

    return chats.map(chat => new ChatModel(chat));
  }

  public async deleteChat(id: number): Promise<void> {
    await this.chatsRepository.delete({ id });
  }

  public async getChatBetweenUsers(firstUser: UserEntity, secondUser: UserEntity): Promise<ChatEntity> {
    const chats = await this.chatsRepository.find({
      where: [
        {
          firstUser: {
            id: firstUser.id
          },
          secondUser: {
            id: secondUser.id
          }
        }, 
        {
          firstUser: {
            id: secondUser.id
          },
          secondUser: {
            id: firstUser.id
          }
        }
      ]
    });

    if (chats.length === 0) {
      throw new BadRequestException('Такого чата нет');
    }

    return chats[0];
  }

  private async chatBetweenUsersExists(firstUser: UserEntity, secondUser: UserEntity): Promise<boolean> {
    const chatsCount = await this.chatsRepository.count({
      where: [
        {
          firstUser: {
            id: firstUser.id
          },
          secondUser: {
            id: secondUser.id
          }
        }, 
        {
          firstUser: {
            id: secondUser.id
          },
          secondUser: {
            id: firstUser.id
          }
        }
      ]
    });

    return chatsCount > 0;
  }

}
