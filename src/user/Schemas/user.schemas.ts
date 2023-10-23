import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
	APPLICANT = 'applicant',
	CONTRACTOR = 'contractor'
}

@Schema({
    timestamps: true,
  })
export class User  {
	@Prop({unique: true})
	email: string
	@Prop()
	password: string
	@Prop()
	nickname: string
	@Prop()
	inn?: string
	@Prop({default: false})
	isAdmin: boolean
	@Prop()
	role: Role
}
export const UserSchema = SchemaFactory.createForClass(User);