import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ok } from 'assert';
import { AuthService } from './auth/auth.service';
import JwtRefreshGuard from './auth/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User, UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async hello() {
    return 'hello';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {    
    return req.user;
  }
}
