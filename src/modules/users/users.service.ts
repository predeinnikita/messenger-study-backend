import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {
  }

  async findById(id: number): Promise<UserEntity | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOneBy({ username });
  }

  async findUsersByUsername(username: string = ''): Promise<UserEntity[] | undefined> {
    return this.usersRepository.findBy({ username });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.findById(userId);
    if (user) {
      user.currentHashedRefreshToken = currentHashedRefreshToken;
      user.save();
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId); 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async createAccount(username: string, password: string) {
    if (await this.usersRepository.findOneBy({ username })) {
      throw new BadRequestException('Такой никнейм уже существует');
    }
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.password = password;
    newUser.save();
  }

}
