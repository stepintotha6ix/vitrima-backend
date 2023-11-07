import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class User {
	@Prop({ unique: true })
	email: string
	@Prop()
	password: string
	@Prop()
	nickname: string
	
	_id: mongoose.Types.ObjectId
	
	isAdmin: boolean
}
export const UserSchema = SchemaFactory.createForClass(User)

@Schema()
export class Contractor extends User {
	@Prop()
	inn: string
	@Prop()
	work: string
	@Prop()
	subscribers: Applicant[]
}
export const ContractorSchema = SchemaFactory.createForClass(Contractor)

@Schema()
export class Applicant extends User {
	@Prop()
	subscriptions: Contractor[]
}
export const ApplicantSchema = SchemaFactory.createForClass(Applicant)
