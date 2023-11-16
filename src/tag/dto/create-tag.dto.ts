
import { IsNumber, IsString, isString } from 'class-validator'

export class CreateTagDto {
	
	@IsString()
	title: string
	@IsString()
	slug: string

}
