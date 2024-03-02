import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthApplicantDto, AuthContractorDto, LoginDto } from './dto/auth.dto'
import { hash, genSalt, compare } from 'bcryptjs'
import { Contractor, Applicant, User } from 'src/user/Schemas/user.schema'
import mongoose, { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { InjectModel } from '@nestjs/mongoose'
import { HttpService } from 'src/http/http.service'
import { ConfigService } from '@nestjs/config'
const uuid = require('uuid')
import { MailService } from './mail.service'
@Injectable()
export class AuthService {
	constructor(
		configService: ConfigService,
		@InjectModel('Applicant') private readonly applicantModel: Model<Applicant>,
		@InjectModel('Contractor')
		private readonly contractorModel: Model<Contractor>,
		private readonly httpService: HttpService,
		private readonly mailService: MailService,

		private readonly jwtService: JwtService
	) {}

	async registerContractor(authDto: AuthContractorDto) {
		const oldUser = await this.contractorModel.findOne({
			email: authDto.email,
		})

		if (oldUser) {
			throw new BadRequestException(
				'Данная почта уже используется'
			)
		}
		let typeSEE = 'SELF-EMPLOYED'
		const typeIP = await this.httpService.validateInnForIP(authDto.inn)
		let typeSE = await this.httpService.validateInnForSE(authDto.inn)
		if (typeSE.code === true) {
			return typeSEE === 'SELF-EMPLOYED'
		}
		if (typeIP === undefined && typeSE.status === false) {
			throw new BadRequestException('ИНН не найден')
		}

		const salt = await genSalt(10)
		const hashedPassword = await hash(authDto.password, salt)
		const activationLink = uuid.v4()

		const newUser = new this.contractorModel({
			email: authDto.email,
			password: hashedPassword,
			nickname: authDto.nickname,
			inn: authDto.inn,
			type: typeIP || typeSEE,
			activationLink: activationLink,
		})
		//await this.mailService.sendActivationMail(authDto.email, `${process.env.API_URL}/api/users/activate/${activationLink}`)

		const user = await newUser.save()
		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async registerApplicant(authDto: AuthApplicantDto) {
		const oldUser = await this.applicantModel.findOne({ email: authDto.email })
		if (oldUser) throw new BadRequestException('Данная почта уже используется')

		const salt = await genSalt(10)
		const activationLink = uuid.v4()

		const newUser = new this.applicantModel({
			email: authDto.email,
			password: await hash(authDto.password, salt),
			nickname: authDto.nickname,
			activationLink: activationLink,
		})
		//await this.mailService.sendActivationMail(authDto.email, `${process.env.API_URL}/api/users/activate/${activationLink}`)

		const user = await newUser.save()

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Пожалуйста, войдите снова')
		}

		const result = await this.jwtService.verifyAsync(refreshToken, {
			secret: process.env.JWT_SECRET,
		})
		if (!result) {
			throw new UnauthorizedException('Токен невалиден или закончился')
		}

		const applicant = await this.applicantModel.findById(result._id)
		const contractor = await this.contractorModel.findById(result._id)

		if (!applicant && !contractor) {
			throw new UnauthorizedException('Пользователь не найден')
		}
		const user = applicant || contractor
		const userId = String(user._id)
		const tokens = await this.issueTokenPair(userId)

		return {
			user: this.returnUserFields(applicant || contractor),
			...tokens,
		}
	}

	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto)
		const tokens = await this.issueTokenPair(String(user._id))

		return { user: this.returnUserFields(user), ...tokens }
	}

	async validateUser(loginDto: LoginDto) {
		const contractorUser = await this.contractorModel.findOne({
			email: loginDto.email,
		})
		const applicantUser = await this.applicantModel.findOne({
			email: loginDto.email,
		})

		if (!contractorUser && !applicantUser) {
			throw new UnauthorizedException('Пользователь не найден')
		}

		const user = contractorUser || applicantUser

		const isValidPassword = await compare(loginDto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '30d',
			secret: process.env.JWT_SECRET,
		})
		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '30m',
			secret: process.env.JWT_SECRET,
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: User) {
		return {
			_id: user._id,
			email: user.email,
			nickname: user.nickname,
			isContractor: user.isContractor,
			isAdmin: user.isAdmin,
		}
	}
}
