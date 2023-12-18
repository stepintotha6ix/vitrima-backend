import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubTypeSchema, WorkSchema, WorkTypeSchema } from 'src/work/work.schema';
import { WorkService } from 'src/work/work.service';
import { TagSchema } from './tag.schema';
import { UserService } from 'src/user/user.service';
import { ApplicantSchema, ContractorSchema } from 'src/user/Schemas/user.schema';

@Module({
  controllers: [TagController],
  providers: [TagService, WorkService, UserService],
  imports: [
    MongooseModule.forFeature([
      {
				schema: WorkTypeSchema,
				name: 'WorkType',
			},{
				schema: SubTypeSchema,
				name: 'SubType',
			},
			
      {
        schema: WorkSchema,
        name:'Work'
      },
      {
        schema: TagSchema,
        name: 'Tag'
      },
      {
        schema: ContractorSchema,
        name: 'Contractor'
      },{
        schema: ApplicantSchema,
        name: 'Applicant'
      },
    ])
  ]
})
export class TagModule {}
