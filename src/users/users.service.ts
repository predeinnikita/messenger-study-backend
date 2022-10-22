import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class User {
  userId: number;
  username: string;
  password?: string;
  currentHashedRefreshToken?: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'npredein',
        password: 'secret',
      },
      {
        userId: 2,
        username: 'admin',
        password: 'admin',
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
    console.log('REFRESH')
    console.log(refreshToken)
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

}
