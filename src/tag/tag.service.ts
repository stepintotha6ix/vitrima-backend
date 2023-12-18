import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './tag.schema';
import { WorkService } from 'src/work/work.service';
import { ICollection } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectModel('Tag') private readonly tagModel: Model<Tag>,
     private readonly workService: WorkService,
	) {}

  async createTag() {
		const defaultValue: CreateTagDto = {
			title: '',
			slug: '',
			
			
		}
		const genre = await this.tagModel.create(defaultValue)
		return genre._id
	}

  async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			}
		return this.tagModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })
	}

  async getCollections() {
		const tags = await this.getAll()
		const collections = await Promise.all(
			tags.map(async (tag) => {
				const workByTag = await this.workService.byTags([tag._id])

				if (workByTag.length == 0) return null

				const result: ICollection = {
					_id: String(tag._id),
					title: tag.title,
					slug: tag.slug,
				}

				return result
			})
		)

		return collections
	}

  findAll() {
    return `This action returns all tag`;
  }

  async byId(_id: string) {
		const tag = await this.tagModel.findById(_id)
		if (!tag) throw new NotFoundException('Тег не найден')
		return tag
	}

  async bySlug(slug: string) {
		const doc = await this.tagModel.findOne({ slug }).exec()
		if (!doc) throw new NotFoundException('тег не найден')
		return doc
	}

	async update(_id: string, dto: CreateTagDto) {
		const updateDoc = await this.tagModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('тег не найден')

		return updateDoc
	}


  async delete(id: string) {
		const deleteDoc = await this.tagModel.findByIdAndRemove(id).exec()

		if (!deleteDoc) throw new NotFoundException('Genre not found')

		return deleteDoc
	}
}
