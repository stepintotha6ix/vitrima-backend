// messages.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './messages.gateway';
import { MessageService } from './messages.service';
import { MessageSchema } from './messages.model';
import { MessageController } from './messages.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessagesModule {}
