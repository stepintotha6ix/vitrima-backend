import { IsEmail } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	password?: string

    nickname: string

	overview?: string
    
	isAdmin?: boolean
	
	image?: string

}