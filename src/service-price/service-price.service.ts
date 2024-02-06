import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicePriceDto } from './dto/create-service-price.dto';
import { UpdateServicePriceDto } from './dto/update-service-price.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ServicePrice } from './service-price.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ServicePriceService {
  constructor(
		@InjectModel('ServicePrice') private readonly servicePriceModel: Model<ServicePrice>,
		private readonly contractorService: UserService
		
	) {}

	async create(servicePriceDto: CreateServicePriceDto) {
		const newServicePrice = new this.servicePriceModel({
			title: servicePriceDto.title,
			price: servicePriceDto.price,
			contractorId: servicePriceDto.contractorId
			
			
		})
		
		const servicePrice = await newServicePrice.save()
		return servicePrice
	}

  async byContractor(contractorId: Types.ObjectId) {
		const docs = await this.servicePriceModel.find({ contractorId: contractorId }).exec()
		if (!docs) throw new NotFoundException('Услуги не найдены')
		return docs
	}
	async byId(_id: string) {
		const genre = await this.servicePriceModel.findById(_id)
		if (!genre) throw new NotFoundException('Услуга не найдена')
		return genre
	}

  findAll() {
    return `This action returns all servicePrice`;
  }

 

  async update(_id: string, dto: CreateServicePriceDto) {
		const updateDoc = await this.servicePriceModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Услуги не найдены')

		return updateDoc
	}


	async delete(id: string) {
		const deleteDoc = await this.servicePriceModel.findByIdAndRemove(id).exec()

		if (!deleteDoc) throw new NotFoundException('Услуга не найдена')

		return deleteDoc
	}
}
