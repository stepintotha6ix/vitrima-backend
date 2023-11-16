import { TagSchema } from './../tag/tag.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"

class Category { 
  @Prop()
  title: string
  _id: mongoose.Types.ObjectId

}

@Schema()
export class Work {
  _id: mongoose.Types.ObjectId
  @Prop()
  price: number
  @Prop()
  category: Category
  @Prop()
  title: string
  @Prop()
  description: string
  @Prop({unique: true})
  slug: string
    @Prop()
  images: string[]
  @Prop({ type: String, ref: 'Tag' })
	tags: string[]
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' })
  contractorId: mongoose.Types.ObjectId;

}
export const WorkSchema = SchemaFactory.createForClass(Work);


