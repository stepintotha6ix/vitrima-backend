import { Injectable } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { UpdateWorkDto } from './dto/update-work.dto'
import { Work } from './work.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class WorkService {
	constructor(@InjectModel('Work') private readonly workModel: Model<Work>) {}
	
  async createWork(workDto: CreateWorkDto) {
		const newWork = new this.workModel({
    //   price: workDto
    //   category:
    //   title:
    //   description:
    //   images:
    //   tags:
    })
		return 'This action adds a new job'
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
