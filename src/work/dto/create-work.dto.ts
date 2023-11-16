import { IsNumber, IsString, isString } from 'class-validator'

export class CreateWorkDto {
	@IsNumber()
	price: number

	category: string[]
	@IsString()
	title: string
	@IsString()
	description: string
	@IsString()
	images: string[]
	@IsString()
	tags: string[]
	@IsString()
	slug: string

	@IsString()
	contractorId: string
}
