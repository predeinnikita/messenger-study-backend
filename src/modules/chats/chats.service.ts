import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/entities/chat.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
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
    console.log(userId, otherUserId)
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

    // chat.save();
  }

  public async getChats(userId: number): Promise<ChatEntity[]> {
    const chats = await this.chatsRepository.find({
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
      ]
    });    

    return chats;
  }

  public async deleteChat(id: number): Promise<void> {
    await this.chatsRepository.delete({ id });
  }

  private async chatBetweenUsersExists(firstUser: UserEntity, secondUser: UserEntity): Promise<boolean> {
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
    
    return chats.length > 0;
  }

}
