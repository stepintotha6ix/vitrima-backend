// message.service.ts

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from './messages.model'
import { ChatService } from 'src/chat/chat.service'

@Injectable()
export class MessageService {
	constructor(
		@InjectModel(Message.name) private readonly messageModel: Model<Message>,
		private readonly chatService: ChatService
	) {}

	async createMessage(messageData: Partial<Message>): Promise<Message> {
		const newMessage = new this.messageModel(messageData)
		return newMessage.save()
	}

	async getMessagesByChatId(chatId: string): Promise<Message[]> {
		return this.messageModel
			.find({
				chatId: chatId,
			})
	}
}
