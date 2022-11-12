import { Body, Controller, Get, Param, Query } from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { IUser } from "./interface/user.interface";
import { UsersService } from "./users.service";

@Controller('users')
export class UserController {
    constructor(
        private usersService: UsersService
    ) {}

    @Get('find')
    public async getUsers(@Query('username')username: string = ''): Promise<IUser[]> {
        console.log(username);
        
        const userEntities = await this.usersService.findUsersByUsername(username);
        return userEntities.map((user: UserEntity) => ({
            id: user.id,
            username: user.username
        }));
    }
}