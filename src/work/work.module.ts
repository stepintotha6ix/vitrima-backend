import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './Work.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSchema } from './work.schema';
import { UserService } from 'src/user/user.service';
import { ApplicantSchema, ContractorSchema, UserSchema } from 'src/user/Schemas/user.schema';
import { TagSchema } from 'src/tag/tag.schema';

@Module({
  controllers: [WorkController],
  providers: [WorkService, UserService],
  imports: [
		MongooseModule.forFeature([
			
			{
				schema: WorkSchema,
				name: 'Work',
			},
			{
				schema: ContractorSchema,
				name: 'Contractor'
			},
			{
				schema: ApplicantSchema,
				name: 'Applicant'
			},
			{
				schema: TagSchema,
				name: 'Tag'
			}
		]),
	],
})
export class WorkModule {}
