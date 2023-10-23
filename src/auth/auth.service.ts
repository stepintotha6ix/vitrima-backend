import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import {hash, genSalt, compare} from 'bcryptjs'
import { User } from 'src/user/Schemas/user.schemas'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private UserModel: mongoose.Model<User>
	) {}

	async register(authDto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: authDto.email })
		if (oldUser) {
			throw new BadRequestException('Пользователь с данной почтой существует')
		}
    let newUserData: any = {
      inn: authDto.inn,
      nickname: authDto.nickname,
      role: authDto.role,
      email: authDto.email,
      password: null // Мы пока не хешируем пароль, так как это будет сделано ниже в коде
    };

    // if (authDto.role === 'contractor' && authDto.additionalData) {
    //   newUserData.inn = authDto.additionalData;
    //   // Делайте что-то с ИНН (например, проверять его корректность)
    // }
    const salt = await genSalt(10)
    newUserData.password = await hash(authDto.password, salt )

    const newUser = new this.UserModel(newUserData);
		return newUser.save()
	}

	findAll() {
		return `This action returns all auth`
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`
	}

	remove(id: number) {
		return `This action removes a #${id} auth`
	}
}
