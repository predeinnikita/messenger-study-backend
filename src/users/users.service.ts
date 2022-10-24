import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class User {
  userId: number;
  username: string;
  password?: string;
  currentHashedRefreshToken?: string;

  constructor(username?: string, password?: string) {
    if (username) {
      this.username = username;
    }
    if (password) {
      this.password = password;
    }
  }

}

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'npredein',
        password: '5ebe2294ecd0e0f08eab7690d2a6ee69',
      },
      {
        userId: 2,
        username: 'admin',
        password: 'f6fdffe48c908deb0f4c3bd36c032e72',
      }
    ];
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = this.users.find(user => user.userId === userId);
    if (user) {
      user.currentHashedRefreshToken = currentHashedRefreshToken;
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
    if (this.users.find(user => user.username === username)) {
      throw new BadRequestException('Такой никнейм уже существует');
    }
    this.users.push(new User(username, password));
  }

}
