import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class ServicePrice {
	_id: mongoose.Types.ObjectId
	@Prop()
	price: number
	@Prop()
	title: string
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' })
	contractorId: mongoose.Types.ObjectId
	@Prop({ type: Date, default: Date.now })
	createdAt: Date
}
export const ServicePriceSchema = SchemaFactory.createForClass(ServicePrice)
