// chat.controller.ts

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() body: { senderId: string; receiverId: string }) {
    const newChat = await this.chatService.createChat(body.senderId, body.receiverId );
    return newChat;
  }

  @Get(':userId')
  async getChatsByUserId(@Param('userId') userId: string) {
    const chats = await this.chatService.getChatsByUserId(userId);
    return chats;
  }

  @Get('find/:firstUserId/:secondUserId')
  async findChatByUserIds(
    @Param('firstUserId') firstUserId: string,
    @Param('secondUserId') secondUserId: string,
  ) {
    const chat = await this.chatService.findChatByUserIds(firstUserId, secondUserId);
    return chat;
  }
}
