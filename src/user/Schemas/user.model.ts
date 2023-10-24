import { prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({unique: true})
	email: string
	@prop()
	password: string
	@prop()
	nickname: string
	@prop()
	isAdmin: boolean
}
export interface ContractorModel extends Base {}


export class ContractorModel extends UserModel{
	
	@prop()
	inn: string
	@prop()
	work: string
	@prop()
	subscribers: ApplicantModel[]


}

export interface ApplicantModel extends Base {}


export class ApplicantModel extends UserModel{
	
	@prop()
	subscriptions: ContractorModel[]

}