import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class Tag {
	_id: mongoose.Types.ObjectId
    @Prop({ type: String })
    title: string;
    @Prop({unique: true})
    slug: string

}
export const TagSchema = SchemaFactory.createForClass(Tag)
