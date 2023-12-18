import mongoose, { Date, Types } from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Message {
	
	@Prop()
	chatId: string
	@Prop({ type: String })
	sender: string
	@Prop()
	text: string
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message)
