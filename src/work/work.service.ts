import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { UpdateWorkDto } from './dto/update-work.dto'
import { Work } from './work.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, Types } from 'mongoose'

import { UserService } from 'src/user/user.service'
import { User } from 'src/user/Schemas/user.schema'

@Injectable()
export class WorkService {
	constructor(
		@InjectModel('Work') private readonly workModel: Model<Work>,
		private readonly contractorService: UserService
		
	) {}

	async createWork(workDto: CreateWorkDto) {
		const contractor = await this.contractorService.contractorById(
			workDto.contractorId
		)
		if (!contractor) {
			throw new NotFoundException('Contractor not found')
		}

		const newWork = new this.workModel({
			price: workDto.price,
			category: workDto.category,
			title: workDto.title,
			description: workDto.description,
			images: workDto.images,
			tags: workDto.tags,
			slug: workDto.slug,
			contractorId: workDto.contractorId,
		})
		const work = await newWork.save()
		return work
	}

	findAll() {
		return `This action returns all job`
	}

	async bySlug(slug: string) {
		const doc = await this.workModel.findOne({ slug }).populate('users').exec()
		return doc
	}
	async byGenres(tagIds: Types.ObjectId[]) {
		return this.workModel.find({ tags: { $in: tagIds } }).exec()
	}

	update(id: number, updateWorkDto: UpdateWorkDto) {
		return `This action updates a #${id} job`
	}

	remove(id: number) {
		return `This action removes a #${id} job`
	}
}
