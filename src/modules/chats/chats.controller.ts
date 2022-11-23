import { Controller, Param, Post, UseGuards, Request, Query, BadRequestException, HttpCode, HttpStatus, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatEntity } from "src/entities/chat.entity";
import ChatModel from "src/models/chat.model";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChatsService } from "./chats.service";

@Controller('chats')
export class ChatsController {
  constructor(
    private chatsService: ChatsService
  ) {}


  @Post('create')
  @UseGuards(JwtAuthGuard)
  public async createChat(@Request()request, @Query('otherUserId')otherUserId: number): Promise<number> {
    if (!otherUserId) {
      throw new BadRequestException('Требуется передача otherUserId!');
    }
    await this.chatsService.createChat(request.user.id, otherUserId);

    return HttpStatus.OK;
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  public async deleteChat(@Query('id')id: number): Promise<void> {
    await this.chatsService.deleteChat(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  public async getMyChats(@Request()request): Promise<ChatModel[]> {
    return this.chatsService.getChats(request.user.id);
  }
}