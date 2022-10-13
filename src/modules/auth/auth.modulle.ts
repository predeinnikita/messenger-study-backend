import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AccountModule } from "../account/account.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { JwtStrategy } from "./service/jwt.strategy";
import { LocalStrategy } from "./service/local.strategy";

@Module({
    imports: [
        AccountModule,
        PassportModule,
        JwtModule.register({
            secret: 'jwtConstants.secret',
            signOptions: { expiresIn: '1d' },
          }),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ]
})
export class AuthModule {}