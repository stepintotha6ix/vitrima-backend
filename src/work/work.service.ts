import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { UpdateWorkDto } from './dto/update-work.dto'
import { Work } from './work.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, ObjectId, Types } from 'mongoose'

import { UserService } from 'src/user/user.service'
import { User } from 'src/user/Schemas/user.schema'

@Injectable()
export class WorkService {
	constructor(
		@InjectModel('Work') private readonly workModel: Model<Work>,
		private readonly contractorService: UserService
	) {}

	async createWork(workDto: CreateWorkDto) {
		// const contractor = await this.contractorService.contractorById(
		// 	workDto.contractorId
		// )
		// if (!contractor) {
		// 	throw new NotFoundException('Contractor not found')
		// }

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

	async byTags(tagIds: Types.ObjectId[]): Promise<Work[]> {
		return this.workModel.find({ tags: { $in: tagIds } }).exec()
	}
	async byContractor(contractorId: Types.ObjectId) {
		const docs = await this.workModel
			.find({ contractorId: contractorId })
			.exec()
		if (!docs) throw new NotFoundException('Услуги не найдены')
		return docs
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.workModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })

			.exec()
	}

	async byId(_id: string) {
		const doc = await this.workModel.findById(_id)
		if (!doc) throw new NotFoundException('Работа не найдена')
		return doc
	}

	async bySlug(slug: string) {
		const doc = await this.workModel
			.findOne({ slug })
			.populate('contractors')
			.exec()
		return doc
	}

	async update(_id: string, dto: UpdateWorkDto) {
		const workDoc = await this.workModel.findById(_id).exec()

		if (!workDoc) {
			throw new NotFoundException('Работа не найдена')
		}

		// Извлекаем contractorId из объекта
		const contractorId = dto.contractorId

		const workContractorIdString = workDoc.contractorId
			? workDoc.contractorId.toString()
			: null

		if (workContractorIdString !== contractorId) {
			throw new ForbiddenException(
				'You do not have permission to delete this work'
			)
		}

		const updateDoc = await this.workModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec()
		if (!updateDoc) throw new NotFoundException('Работа не найдена')
		return updateDoc
	}

	async delete(id: string, contractorIdObj: { contractorId: string }) {
		const workDoc = await this.workModel.findById(id).exec()

		if (!workDoc) {
			throw new NotFoundException('Work not found')
		}

		// Извлекаем contractorId из объекта
		const contractorId = contractorIdObj.contractorId

		const workContractorIdString = workDoc.contractorId
			? workDoc.contractorId.toString()
			: null

		if (workContractorIdString !== contractorId) {
			throw new ForbiddenException(
				'You do not have permission to delete this work'
			)
		}

		const deleteDoc = await this.workModel.findByIdAndRemove(id).exec()

		if (!deleteDoc) {
			throw new NotFoundException('Work not found')
		}

		return deleteDoc
	}
}
