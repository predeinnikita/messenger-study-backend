import { Injectable } from '@nestjs/common';

export type User = any;

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
    return this.users.find(user => user.id === id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }
}
