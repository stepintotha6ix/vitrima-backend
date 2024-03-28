import mongoose, { Date, Types } from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
class MessageStatus {
	SENT = 'sent'
	READ = 'read'
	DELIVERED = 'delivered'

  }
@Schema()
export class Message {
	@Prop()
	chatId: string
	@Prop({ type: String })
	sender: string
	@Prop()
	text: string
	@Prop({ type: Date, default: Date.now })
	createdAt: Date
	@Prop()
	status: string
}
export const MessageSchema = SchemaFactory.createForClass(Message)
