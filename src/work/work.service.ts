import { Injectable } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { UpdateWorkDto } from './dto/update-work.dto'
import { Work } from './work.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'

import { UserService } from 'src/user/user.service'
import { User } from 'src/user/Schemas/user.schema'

@Injectable()
export class WorkService {
	constructor(
		@InjectModel('Work') private readonly workModel: Model<Work>,
		
		 ) {}

	async createWork(workDto: CreateWorkDto) {
		

		const newWork = new this.workModel({
			price: workDto.price,
			category: workDto.category,
			title: workDto.title,
			description: workDto.description,
			images: workDto.images,
			tags: workDto.tags,
		})

		const work = await newWork.save()
		return work
	}

	findAll() {
		return `This action returns all job`
	}

	findOne(id: number) {
		return `This action returns a #${id} job`
	}

	update(id: number, updateWorkDto: UpdateWorkDto) {
		return `This action updates a #${id} job`
	}

	remove(id: number) {
		return `This action removes a #${id} job`
	}
}
