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
  @Prop()
  userId: string
  @Prop()
  images: string
  @Prop()
  tags: string[]
}
export const WorkSchema = SchemaFactory.createForClass(Work);


