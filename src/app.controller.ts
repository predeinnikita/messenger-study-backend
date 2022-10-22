import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {    
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/refresh')
  async refresh(@Request() req) {
    console.log('req.user');
    console.log(req.user);
    
    const user = await this.usersService.findById(req.user.userId);
    console.log('user');
    console.log(user);
    
    return this.authService.login(user);
  }
}
