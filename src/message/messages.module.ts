// messages.module.ts

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessageGateway } from './messages.gateway'
import { MessageService } from './messages.service'
import { MessageSchema } from './messages.model'
import { MessageController } from './messages.controller'
import { ChatService } from 'src/chat/chat.service'
import { ChatSchema } from 'src/chat/chat.model'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Message', schema: MessageSchema },
			{
				name: 'Chat',
				schema: ChatSchema,
			},
		]),
	],
	controllers: [MessageController],
	providers: [ChatService, MessageService, MessageGateway],
})
export class MessagesModule {}
