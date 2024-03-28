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
		private readonly chatService: ChatService,
	) {}

	async createMessage(messageData: Partial<Message>): Promise<Message> {
		// Устанавливаем значение поля status в "sent"
		messageData.status = "sent";
	  
		// Создаем новый объект типа Message
		const newMessage = new this.messageModel(messageData);
	  
		// Сохраняем новое сообщение в базе данных
		const savedMessage = await newMessage.save();
	  
		return savedMessage;
	  }

	async getMessagesByChatId(chatId: string): Promise<Message[]> {
		
		return this.messageModel.find({
			chatId: chatId,
		})
	}
	async changeStatusMessage(_id){
		const updateMessage = await this.messageModel
		.findByIdAndUpdate(_id,  {
			status: "read",
		})
		.exec()
		return updateMessage
	}
}
