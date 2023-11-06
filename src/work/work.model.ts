import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"


@Schema()
export class Work {
  @Prop()
  title: string
  @Prop()
  description: string
  @Prop()
  images: string
  @Prop()
  tags: string[]
}
export const WorkSchema = SchemaFactory.createForClass(Work);


