import { Controller, Request,  Post, UseGuards, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "src/modules/account/model/account";
import { AuthService } from "../service/auth.service";

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request()req: LoginResponse) {                
        return this.authService.login(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        console.log('req');
        
        console.log(req.user);
        return req.user;
    }
}

export interface LoginResponse {
    user: Account
}

export interface getProfileResponse {
    user: {
    }
}