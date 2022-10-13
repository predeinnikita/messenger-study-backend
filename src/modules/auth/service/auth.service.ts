import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccountRepository } from "src/modules/account/service/account.repository";

@Injectable()
export class AuthService {
    constructor(
        private accountRepository: AccountRepository,
        private jwtService: JwtService
    ) {

    }

    async validateAccount(login: string, password: string): Promise<any> {
        console.log('validateAccount')
        const account = await this.accountRepository.findByLogin(login);

        if (account && account.password === password) {
            const {password, ...secureAccount} = account;
            return secureAccount;
        }
        return null;
    }

    async login(user: any) {
        const payload = { login: user.login, id: user.id };
        console.log('user');
        
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}