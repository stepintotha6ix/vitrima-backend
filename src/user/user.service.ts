import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Applicant, Contractor } from './Schemas/user.schema';


@Injectable()
export class UserService {
  constructor(
		@InjectModel('Contractor')
		private readonly contractorModel: Model<Contractor>,
    @InjectModel('Applicant')
		private readonly applicantModel: Model<Applicant>,
    
  
    ) {}
 async contractorById(_id: string) {
  const user = await this.contractorModel.findById(_id)
  if (!user) throw new NotFoundException('User not found')
  return user


  }

  findAll() {
    return `This action returns all user`;
  }
  async getContractorWorks(contractorId: string) {
    const contractor = await this.contractorModel.findById(contractorId).populate('works').exec();

    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    return contractor.works;
  }

  async getCountContractors() {
		return this.contractorModel.find().count().exec()
	}
  
  async getCountApplicants() {
		return this.applicantModel.find().count().exec()
	}


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
