import { WorkModel } from '../work/work.model';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ContractorModel, UserModel, ApplicantModel } from './Schemas/user.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
        collection: 'User',
        },
      },  
      {
        typegooseClass: ContractorModel,
        schemaOptions: {
        collection: 'Contractor',
        },
      },   
      {
        typegooseClass: ApplicantModel,
        schemaOptions: {
        collection: 'Applicant',
        },
      }, 
      {  
          typegooseClass: WorkModel,
          schemaOptions: {
          collection: 'Work',
          },
        }
      ]),
  ]
})
export class UserModule {}
