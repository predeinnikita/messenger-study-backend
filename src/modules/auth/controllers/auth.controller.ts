import { Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from '../auth.service';
import JwtRefreshGuard from '../guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user: UserEntity = req.user;    
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
    req.res.setHeader('Set-Cookie', [ refreshTokenCookie.cookie ]);

    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Request()request) {
    const accessToken = this.authService.getJwtAccessToken(request.user);
    
    return accessToken;
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-token')
  checkToken() {
    return HttpStatus.OK;
  }

  @Post('registration')
  async registrateUser(@Request() req: any) {
    await this.usersService.createAccount(req.body.username, req.body.password);
    
    return HttpStatus.OK;
  }

  @Post('logout')
  async logout(@Request() req) {
    req.res.setHeader('Set-Cookie', [ 'Refresh=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' ]);

    return HttpStatus.OK;
  }
}
