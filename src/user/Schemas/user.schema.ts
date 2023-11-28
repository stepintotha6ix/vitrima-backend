import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Work } from 'src/work/work.schema'

@Schema()
export class User {
	@Prop({ unique: true })
	email: string
	@Prop()
	password: string
	@Prop({unique: true})
	nickname: string
	@Prop({ default: false })
	isAdmin: boolean
	@Prop()
	isContractor: boolean

	_id: mongoose.Types.ObjectId

	@Prop({ type: Date, default: Date.now })
    createdAt: Date

	@Prop({type: String})
	image: string

	
}
export const UserSchema = SchemaFactory.createForClass(User)

@Schema()
export class Contractor extends User {
	@Prop()
	inn: string
	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }])
	works: mongoose.Types.ObjectId[];
	@Prop()
	subscribers: Applicant[]
	@Prop({ default: true })
	isContractor: boolean
	@Prop()
	description: string
}
export const ContractorSchema = SchemaFactory.createForClass(Contractor)

@Schema()
export class Applicant extends User {
	@Prop()
	subscriptions: Contractor[]
	@Prop({ default: false })
	isContractor: boolean
	@Prop()
	overview : string

}
export const ApplicantSchema = SchemaFactory.createForClass(Applicant)
