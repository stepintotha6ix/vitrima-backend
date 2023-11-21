import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Types } from 'mongoose'

@Schema()
export class Tag {
    _id: Types.ObjectId;
    @Prop({ type: String })
    title: string;
    @Prop({unique: true})
    slug: string

    @Prop({ type: String, ref: 'Work' })
	works: string[]

}
export const TagSchema = SchemaFactory.createForClass(Tag)
