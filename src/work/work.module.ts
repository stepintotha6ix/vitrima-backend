import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './Work.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSchema } from './work.schema';

@Module({
  controllers: [WorkController],
  providers: [WorkService],
  imports: [
		MongooseModule.forFeature([
			
			{
				schema: WorkSchema,
				name: 'Work',
			},
		]),
	],
})
export class WorkModule {}
