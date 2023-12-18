import { TagSchema } from './../tag/tag.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class SubType {
	@Prop({ required: true })
	title: string
	_id: mongoose.Types.ObjectId
	@Prop()
	image: string
	
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'WorkType' })
	workTypeId: mongoose.Types.ObjectId;

	@Prop()
	description: string
}
@Schema()
export class WorkType {
	@Prop()
	title: string
	_id: mongoose.Types.ObjectId
	@Prop()
	slug: string
	
}

@Schema()
export class Work {
	_id: mongoose.Types.ObjectId
	@Prop()
	price: number
	
	@Prop()
	title: string
	@Prop()
	description: string
	@Prop({ unique: true })
	slug: string
	@Prop()
	images: string[]
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
	tags: string[]
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' })
	contractorId: mongoose.Types.ObjectId

	@Prop({ type: Date, default: Date.now })
	createdAt: Date

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'WorkType' })
	workType: string[]
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubType' }] })
  subTypes: SubType[];
}
export const WorkTypeSchema = SchemaFactory.createForClass(WorkType)
export const SubTypeSchema = SchemaFactory.createForClass(SubType)
export const WorkSchema = SchemaFactory.createForClass(Work)
