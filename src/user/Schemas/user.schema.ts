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
	@Prop({default: false})
	isAdmin: boolean
	@Prop()
	isContractor: boolean

	_id: mongoose.Types.ObjectId
	
	
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
	@Prop({ default: true })
	isContractor: boolean

}
export const ContractorSchema = SchemaFactory.createForClass(Contractor)

@Schema()
export class Applicant extends User {
	@Prop()
	subscriptions: Contractor[]
	@Prop({ default: false })
	isContractor: boolean

}
export const ApplicantSchema = SchemaFactory.createForClass(Applicant)
