import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import {
	CreateBuildingTechniqueDto,
	CreateSubTypeDto,
	CreateWorkDto,
	CreateWorkTypeDto,
} from './dto/create-work.dto'
import { BuildingTechnique, SubType, Work, WorkType } from './work.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, ObjectId, Types } from 'mongoose'

import { UserService } from 'src/user/user.service'
import { User } from 'src/user/Schemas/user.schema'
import { UpdateWorkDto } from './dto/update-work.dto'

@Injectable()
export class WorkService {
	constructor(
		@InjectModel('Work') private readonly workModel: Model<Work>,
		@InjectModel('WorkType') private readonly workTypeModel: Model<WorkType>,
		@InjectModel('SubType') private readonly subTypeModel: Model<SubType>,
		@InjectModel('BuildingTechnique')
		private readonly buildingTechniqueModel: Model<BuildingTechnique>,

		private readonly contractorService: UserService
	) {}

	async createSubType(workDto: CreateSubTypeDto) {
		const newWorkType = new this.subTypeModel({
			title: workDto.title,
			image: workDto.image,
			description: workDto.description,
			workTypeId: workDto.workTypeId,
		})
		const workType = await newWorkType.save()
		return workType
	}
	async createBuildingTechnique(workDto: CreateBuildingTechniqueDto) {
		const newBuildingTechnique = new this.buildingTechniqueModel({
			title: workDto.title,
			description: workDto.description,
			workTypeId: workDto.workTypeId,
		})
		const buildingTechnique = await newBuildingTechnique.save()
		return buildingTechnique
	}
	async getAllBuildingTechniques(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.buildingTechniqueModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })

			.exec()
	}

	async byWorkType(workTypeId: Types.ObjectId) {
		const docs = await this.subTypeModel.find({ workTypeId: workTypeId }).exec()
		if (!docs) throw new NotFoundException('Стили не найдены')
		return docs
	}
	async createWorkType(workDto: CreateWorkTypeDto) {
		const newWorkType = new this.workTypeModel({
			slug: workDto.slug,
			title: workDto.title,
		})
		const workType = await newWorkType.save()
		return workType
	}

	async getWorkTypeById(id: string) {
		return await this.workTypeModel.findById(id).populate('subTypes').exec()
	}

	async updateWorkType(_id: string, dto) {
		const updateDoc = await this.workTypeModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec()
		if (!updateDoc) throw new NotFoundException('Категория не найдена')
		return updateDoc
	}
	async getAllWorkTypes(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.workTypeModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })

			.exec()
	}

	async createWork(workDto: CreateWorkDto) {
		const newWork = new this.workModel({
			price: workDto.price,
			workType: workDto.workType,
			subTypes: workDto.subTypes,
			title: workDto.title,
			description: workDto.description,
			images: workDto.images,
			tags: workDto.tags,
			slug: workDto.slug,
			contractorId: workDto.contractorId,
			buildingTechnique: workDto.buildingTechnique,
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
			.populate('workType')
			.populate('subTypes')
			.populate('tags')
			.populate('contractorId')

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
			.populate('workType')
			.populate('subTypes')
			.populate('contractorId')
			.populate('tags')
			.exec()
	}

	async getWorksWithFilters(
		slug: string,
		filterDto: {
			search?: string
			subTypes?: string[]
			minPrice?: number
			maxPrice?: number
			contractorType?: any
			location?: any
			buildingTechnique?: string
		},
		page: number,
		limit: number
	): Promise<Work[]> {
		const {
			search,
			subTypes,
			minPrice,
			maxPrice,
			contractorType,
			location,
			buildingTechnique,
		} = filterDto

		try {
			const workTypeData = await this.workTypeModel
				.aggregate([{ $match: { slug } }, { $sample: { size: 25 } }])
				.exec()

			if (!workTypeData) {
				throw new NotFoundException('WorkType не найден')
			}

			let query = this.workModel
				.find({ workType: workTypeData })
				.sort({ _id: -1 })
				.populate('workType')
				.populate('tags')
				.populate('contractorId')

			if (subTypes && subTypes.length > 0) {
				query = query.find({
					subTypes: { $in: subTypes },
				})
			}

			if (buildingTechnique && buildingTechnique.length > 0) {
				query = query.find({
					buildingTechnique: { $in: buildingTechnique },
				})
			}

			if (minPrice !== undefined) {
				query = query.find({ price: { $gte: minPrice } })
			}

			if (maxPrice !== undefined) {
				query = query.find({ price: { $lte: maxPrice } })
			}
			if (location !== undefined) {
				query = query.find({}) // Сначала сбросим текущий find
				query = query.populate({
					path: 'contractorId',
					match: { location: location },
					select: 'location',
				})
			}
			if (contractorType !== undefined) {
				query = query.find({}) // Сначала сбросим текущий find
				query = query.populate({
					path: 'contractorId',
					match: { type: contractorType },
					select: 'type',
				})
			}

			if (search) {
				query = query.find({ slug: { $regex: new RegExp(search, 'i') } })
			}
			
		
			const startIndex = (page - 1) * limit

			const paginatedWorks = await query.skip(startIndex).limit(limit).exec()
			const filteredWorks = paginatedWorks.filter(
				(work) => work.contractorId !== null
			)

			return filteredWorks
		} catch (error) {
			console.error('Error fetching works with filters', error)
			throw error
		}
	}

	// async workByWorkType(slug: string, limit: number, skip: number = 0) {
	// 	const workTypeData = await this.workTypeModel.findOne({ slug }).exec();

	// 	if (!workTypeData) {
	// 	  throw new NotFoundException('WorkType не найден');
	// 	}

	// 	const docs = await this.workModel
	// 	  .find({ workType: workTypeData._id })
	// 	  .populate('workType')
	// 	  .populate('tags')
	// 	  .populate('contractorId')
	// 	  .skip(skip)
	// 	  .limit(limit)
	// 	  .exec();

	// 	if (!docs || docs.length === 0) {
	// 	  throw new NotFoundException('Работы не найдены');
	// 	}

	// 	return docs;
	//   }

	async bySimilarSubType(subTypes: string[]) {
		if (!subTypes || subTypes.length === 0) {
			throw new NotFoundException('Похожие работы не найдены')
		}

		let works = await this.getAll()

		// Фильтрация работ по subTypes
		works = works.filter((work) =>
			work.subTypes.some((subType) => subTypes.includes(subType._id.toString()))
		)
		return works
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
