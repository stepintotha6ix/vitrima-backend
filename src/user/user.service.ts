import { Injectable, NotFoundException } from '@nestjs/common'

import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Applicant, Contractor } from './Schemas/user.schema'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(
		@InjectModel('Contractor')
		private readonly contractorModel: Model<Contractor>,
		@InjectModel('Applicant')
		private readonly applicantModel: Model<Applicant>
	) {}
	async contractorById(_id: string) {
		const user = await this.contractorModel.findById(_id)
		if (!user) throw new NotFoundException('Подрядчик не найден')
		return user
	}
  async applicantById(_id: string) {
		const user = await this.applicantModel.findById(_id)
		if (!user) throw new NotFoundException('Соискатель не найден')
		return user
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
			const [applicants, contractors] = await Promise.all([
				this.applicantModel
				  .find(options)
				  .select('-password -updatedAt -__v')
				  .sort({ createdAt: 'desc' }),
			
				this.contractorModel
				  .find(options)
				  .select('-password -updatedAt -__v')
				  .sort({ createdAt: 'desc' }),
			  ]);
			
			  // Объединяем результаты запросов
			  const allResults = [...applicants, ...contractors];
			
			  return allResults;
	}

	async getContractorWorks(contractorId: string) {
		const contractor = await this.contractorModel
			.findById(contractorId)
			.populate('works')
			.exec()

		if (!contractor) {
			throw new NotFoundException('Contractor not found')
		}

		return contractor.works
	}

	async getCountContractors() {
		return this.contractorModel.find().count().exec()
	}

	async getCountApplicants() {
		return this.applicantModel.find().count().exec()
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		let user;
	  
		// Попытайтесь найти пользователя в модели Applicant
		user = await this.applicantById(_id);
	  
		// Если не найдено в Applicant, попробуйте в Contractor
		if (!user) {
		  user = await this.contractorById(_id)
		}
	  
		if (!user) {
		  throw new NotFoundException('Пользователь не найден');
		}
	  
		// Проверяем существует ли пользователь с таким email
		const isSameUser = await this.applicantModel.findOne({ email: dto.email }).exec() ||
						  await this.contractorModel.findOne({ email: dto.email }).exec();
	  
		if (isSameUser && String(_id) !== String(isSameUser._id)) {
		  throw new NotFoundException('Почта занята');
		}
	  
		if (dto.password) {
		  const salt = await genSalt(10);
		  user.password = await hash(dto.password, salt);
		}
	  
		user.email = dto.email;
	  
		if (dto.isAdmin !== undefined) {
		  user.isAdmin = dto.isAdmin;
		}
	  
		await user.save();
	  }
	  

	async delete(id: string) {
		const deletedApplicant = await this.applicantModel.findByIdAndRemove(id).exec();

		if (deletedApplicant) {
			return deletedApplicant;
		}
	
		// Если документ с указанным id не был найден в applicantModel,
		// попробуйте удалить его из contractorModel
		const deletedContractor = await this.contractorModel.findByIdAndRemove(id).exec();
	
		return deletedContractor;
	}
}
