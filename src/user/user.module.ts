import { MongooseModule } from '@nestjs/mongoose'
import { WorkSchema } from '../work/work.model'
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import {
	ContractorSchema,
	UserSchema,
	ApplicantSchema,

} from './Schemas/user.schema'

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		MongooseModule.forFeature([
			{
				schema: ContractorSchema,
				name: 'Contractor',
			},
			{
				schema: ApplicantSchema,
				name: 'Applicant',
			},
			{
				schema: WorkSchema,
				name: 'Work',
			},
			{
				schema: UserSchema,
				name: 'User',
			},
		]),
	],
})
export class UserModule {}
