import { IsArray, IsNumber, IsString, isString } from 'class-validator'
import mongoose from 'mongoose'

export class CreateWorkDto {
	@IsNumber()
	price: number

	
	@IsString()
	workType: string
	
	@IsArray()

	subTypes: string[]

	buildingTechnique?: string

	@IsString()
	title: string
	@IsString()
	description: string
	@IsArray()
	images: string[]
	@IsArray()
	@IsString({ each: true })
	tags: string[]
	@IsString()
	slug: string

	@IsString()
	contractorId: string



}

export class CreateBuildingTechniqueDto{
	@IsString()
	title: string
	@IsString()
	description: string
	@IsString()
  workTypeId: mongoose.Types.ObjectId;

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
