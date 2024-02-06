import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator'

export class AuthContractorDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Пароль не может быть меньше 6 символов',
	})
	@IsString()
	password: string

	@IsString()
	nickname: string
	

	@IsString()
	inn: string


}

export class AuthApplicantDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Пароль не может быть меньше 6 символов',
	})
	@IsString()
	password: string

	@IsString()
	nickname: string

	
}

export class LoginDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Пароль не может быть меньше 6 символов',
	})
	@IsString()
	password: string

	
}
