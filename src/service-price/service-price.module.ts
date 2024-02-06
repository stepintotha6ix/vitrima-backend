import { Module } from '@nestjs/common';
import { ServicePriceService } from './service-price.service';
import { ServicePriceController } from './service-price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicePriceSchema } from './service-price.schema';
import { ApplicantSchema, ContractorSchema } from 'src/user/Schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { WorkSchema } from 'src/work/work.schema';

@Module({
  controllers: [ServicePriceController],
  providers: [ServicePriceService, UserService],
  imports: [
		MongooseModule.forFeature([
			
			{
				schema: ServicePriceSchema,
				name: 'ServicePrice',
			},{
				schema: ContractorSchema,
				name: 'Contractor'
			},,{
				schema: ApplicantSchema,
				name: 'Applicant'
			},
			{
				schema: WorkSchema,
				name: 'Work',
			},
		]),
	],
})
export class ServicePriceModule {}
