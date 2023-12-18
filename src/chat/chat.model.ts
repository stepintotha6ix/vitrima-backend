import mongoose, { Date, Types } from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Chat {
  
    _id: Types.ObjectId;
    @Prop()
    members: string[]
    @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
export const ChatSchema = SchemaFactory.createForClass(Chat)
