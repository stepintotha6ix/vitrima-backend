import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthApplicantDto, AuthContractorDto, LoginDto } from './dto/auth.dto'
import { hash, genSalt, compare } from 'bcryptjs'
import { UserModel, ContractorModel, ApplicantModel  } from 'src/user/Schemas/user.model'
import { InjectModel } from 'nestjs-typegoose'
import mongoose from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	
	constructor(
		@InjectModel(UserModel)
		private UserModel: mongoose.Model<UserModel>,
		@InjectModel(ContractorModel)
		private ContractorModel:mongoose.Model<ContractorModel>,
		@InjectModel(ApplicantModel)
		private ApplicantModel:mongoose.Model<ApplicantModel>,
		
		private readonly jwtService: JwtService
	) {}

	async registerContractor(authDto: AuthContractorDto) {
		const oldUser = await this.ContractorModel.findOne({ email: authDto.email })
		if (oldUser)
			throw new BadRequestException(
				'User with this email is already in the system'
			)

		const salt = await genSalt(10)

		const newUser = new this.ContractorModel({
			email: authDto.email,
			password: await hash(authDto.password, salt),
			nickname: authDto.nickname,
			inn: authDto.inn,
		})

		const user = await newUser.save()

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async registerApplicant(authDto: AuthApplicantDto) {
		const oldUser = await this.ApplicantModel.findOne({ email: authDto.email })
		if (oldUser)
			throw new BadRequestException(
				'User with this email is already in the system'
			)

		const salt = await genSalt(10)

		const newUser = new this.ApplicantModel({
			email: authDto.email,
			password: await hash(authDto.password, salt),
			nickname: authDto.nickname,
		})

		const user = await newUser.save()

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken)
			throw new UnauthorizedException('Пожалуйста, войдите снова')

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result)
			throw new UnauthorizedException('Токен невалиден или закончился')

			//			const user = await this.UserModel.findById(result._id)

		const applicator = await this.ApplicantModel.findById(result._id)
		const contractor = await this.ContractorModel.findById(result._id)
		
		const tokens = await this.issueTokenPair(result._id.toString())

		return {
			user: this.returnUserFields(applicator || contractor),
			...tokens,
		}
	}

	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto)
		const tokens = await this.issueTokenPair(String(user._id))

		return { user: this.returnUserFields(user), ...tokens }
	}

	async validateUser(loginDto: LoginDto) {
		const user = await this.UserModel.findOne({ email: loginDto.email })
		if (!user) throw new UnauthorizedException('Пользователь не найден')

		const isValidPassword = await compare(loginDto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '30d',
		})
		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '30m',
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			nickname: user.nickname,

			isAdmin: user.isAdmin,
		}
	}
}
