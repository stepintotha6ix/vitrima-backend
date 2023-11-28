import { IsNumber, IsString } from 'class-validator'

export class CreateServicePriceDto {
	@IsNumber()
	price: number

	@IsString()
	title: string

	@IsString()
	contractorId: string
}
