import { Module } from "@nestjs/common";
import { AccountRepository } from "./service/account.repository";

@Module({
    providers: [
        AccountRepository
    ],
    exports: [
        AccountRepository
    ]
})
export class AccountModule {}