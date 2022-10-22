import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import * as express from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: express.Request) => {
          console.log(request.headers.cookie.split('=')[1]);
          return request.headers.cookie.split('=')[1];
          return request?.cookies?.Refresh
        }
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
  
  async validate(request: express.Request, payload) {
    console.log('request.credentials');
    console.log(request.headers?.cookie);

    const refreshToken = request.headers.cookie.split('=')[1];

    return this.usersService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    // return this.usersService.findById(payload.userId);
  }
}