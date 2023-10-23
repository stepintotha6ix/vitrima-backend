import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
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
	role: string

	inn?: string
}

export class LoginDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Пароль не может быть меньше 6 символов',
	})
	@IsString()
	password: string
	@IsString()
	role: string
}
