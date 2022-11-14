import { Body, Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { NotFoundError } from "rxjs";
import { UserEntity } from "src/entities/user.entity";
import { IUser } from "./interface/user.interface";
import { UsersService } from "./users.service";

@Controller('users')
export class UserController {
    constructor(
        private usersService: UsersService
    ) {}

    @Get('find')
    public async getUsers(@Query('username')username: string = ''): Promise<IUser> {        
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }
        return {
            id: user.id,
            username: user.username
        }
    }
}