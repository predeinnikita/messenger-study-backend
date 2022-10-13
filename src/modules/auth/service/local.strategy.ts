import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Account } from "src/modules/account/model/account";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({
            usernameField: 'login'
        });
    }

    async validate(login: string, password: string): Promise<Account> {
        console.log('validate');
        const account = await this.authService.validateAccount(login, password);
        if (!account) {
            
            throw new UnauthorizedException();
        }

        return account;
    }
}