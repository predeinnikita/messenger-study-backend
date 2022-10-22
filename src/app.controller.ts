import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import JwtRefreshGuard from './auth/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User, UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  async hello() {
    return 'hello';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const user: User = req.user;
    console.log(user);
    
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.userId);
    await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.userId);
    req.res.setHeader('Set-Cookie', [ refreshTokenCookie.cookie ]);

    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {    
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Request()request) {
    const accessToken = this.authService.getJwtAccessToken(request.user);
 
    return accessToken;
  }
}
