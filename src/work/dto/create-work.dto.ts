import { IsArray, IsNumber, IsString, isString } from 'class-validator'
import mongoose from 'mongoose'

export class CreateWorkDto {
	@IsNumber()
	price: number

	@IsString()
	workType: string
	@IsString()
	subTypes: string[]


	@IsString()
	title: string
	@IsString()
	description: string
	@IsString()
	images: string[]
	@IsArray()
	@IsString({ each: true })
	tags: string[]
	@IsString()
	slug: string

	@IsString()
	contractorId: string


}

export class CreateWorkTypeDto {
	@IsString()
	title: string
	@IsString()
	slug: string
	
}

export class CreateSubTypeDto {
	@IsString()
	title: string
	@IsString()
  workTypeId: mongoose.Types.ObjectId;

	@IsString()
	image: string

	@IsString()
	description: string
}
