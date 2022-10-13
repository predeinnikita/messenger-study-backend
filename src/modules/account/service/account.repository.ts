import { Injectable } from '@nestjs/common';
import { Account } from '../model/account';

@Injectable()
export class AccountRepository {
    private readonly accounts: Account[];

    constructor() {
        this.accounts = [
            {
                id: 1,
                login: 'npredein',
                password: 'secret'
            }
        ]
    }

    async findByLogin(login: string): Promise<Account | undefined> {
        return this.accounts.find(account => account.login === login);
    }
}
