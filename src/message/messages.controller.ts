// message.controller.ts

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MessageService } from './messages.service';
import { Message } from './messages.model';
import { MessageGateway } from './messages.gateway';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService, private readonly messageGateway: MessageGateway,) {}

  @Post()
  async createMessage(@Body() messageData: Partial<Message>) {
    const savedMessage = await this.messageService.createMessage(messageData);

    // Notify connected clients about the new message
    this.messageGateway.server.emit('client-path', savedMessage);

    return savedMessage;
  }

  @Get('/:chatId')
  async getMessagesByChatId(@Param('chatId') chatId: string) {
    const messages = await this.messageService.getMessagesByChatId(chatId);
   return messages;
  }
  @Put('/change-status/:id') 
  async changeStatusMessage(@Param('id') id:string){
    return await this.messageService.changeStatusMessage(id)
  }
}
