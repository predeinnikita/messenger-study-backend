import { Injectable } from "@nestjs/common";
import { AccountRepository } from "src/modules/account/service/account.repository";

@Injectable()
export class AuthService {
    constructor(
        private accountRepository: AccountRepository
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
}