import { Injectable, NotFoundException } from '@nestjs/common'

import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId, Types } from 'mongoose'
import { Applicant, Contractor } from './Schemas/user.schema'
import { genSalt, hash } from 'bcryptjs'
import { Work } from 'src/work/work.schema'

@Injectable()
export class UserService {
	constructor(
		@InjectModel('Contractor')
		private readonly contractorModel: Model<Contractor>,
		@InjectModel('Applicant')
		private readonly applicantModel: Model<Applicant>,
		@InjectModel('Work')
		private readonly workModel: Model<Work>
	) {}
	async contractorById(_id: string) {
		const user = await this.contractorModel.findById(_id).exec()
		if (!user) throw new NotFoundException('Подрядчик не найден')
		return user
	}
	async applicantById(_id: string) {
		const user = await this.applicantModel.findById(_id).exec()
		if (!user) throw new NotFoundException('Соискатель не найден')
		return user
	}

	async activate(activationLink) {
		const contractorUser = await this.contractorModel.findOneAndUpdate(
			{ activationLink },
			{ $set: { isActivated: true } },
			{ new: true }
		)

		const applicantUser = await this.applicantModel.findOneAndUpdate(
			{ activationLink },
			{ $set: { isActivated: true } },
			{ new: true }
		)

		if (!contractorUser && !applicantUser) {
			throw new Error('Неккоректная ссылка активации')
		}

		const activatedUser = contractorUser || applicantUser
		return activatedUser
	}

	async getUserById(_id: string) {
		const applicantUser = await this.applicantModel
			.findById(_id)
			.populate('subscriptions')
			.populate('saved')
			.exec()

		// If the applicant user is found, return it
		if (applicantUser) {
			return applicantUser
		}

		// If the applicant user is not found, attempt to find the user in the contractor model
		const contractorUser = await this.contractorModel.findById(_id)

		// If the contractor user is found, return it
		if (contractorUser) {
			return contractorUser
		}

		// If neither applicant nor contractor is found, throw a NotFoundException
		throw new NotFoundException('Пользователь не найден')
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
		const [applicants, contractors] = await Promise.all([
			this.applicantModel
				.find(options)
				.select('-password -updatedAt -__v')
				.sort({ createdAt: 'desc' }),

			this.contractorModel
				.find(options)
				.select('-password -updatedAt -__v')
				.sort({ createdAt: 'desc' }),
		])

		// Объединяем результаты запросов
		const allResults = [...applicants, ...contractors]

		return allResults
	}

	async getContractorWorks(contractorId: string) {
		const contractor = await this.contractorModel
			.findById(contractorId)
			.populate('works')
			.exec()

		if (!contractor) {
			throw new NotFoundException('Contractor not found')
		}

		return contractor.works
	}

	async getCountContractors() {
		return this.contractorModel.find().count().exec()
	}

	async getCountApplicants() {
		return this.applicantModel.find().count().exec()
	}

	async updateProfile(_id: string, updateData: UpdateUserDto) {
		let user

		try {
			user = await this.contractorById(_id)
		} catch (error) {
			try {
				user = await this.applicantById(_id)
			} catch (applicantError) {
				throw new NotFoundException('Пользователь не найден')
			}
		}

		// Проверяем существует ли пользователь с таким email
		const isSameUser =
			(await this.contractorModel
				.findOne({ email: updateData.email })
				.exec()) ||
			(await this.applicantModel.findOne({ email: updateData.email }).exec())

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Почта занята')
		}

		// Обновляем поля в соответствии с переданными данными
		if (updateData.password) {
			const salt = await genSalt(10)
			user.password = await hash(updateData.password, salt)
		}

		for (const key in updateData) {
			if (updateData.hasOwnProperty(key)) {
				// Проверяем, нужно ли обновлять пароль
				if (key === 'password') {
					const salt = await genSalt(10)
					user.password = await hash(updateData[key], salt)
				} else {
					// Обновляем остальные поля
					user[key] = updateData[key]
				}
			}
		}
		await user.save()
	}

	async delete(id: string) {
		const deletedApplicant = await this.applicantModel
			.findByIdAndRemove(id)
			.exec()

		if (deletedApplicant) {
			return deletedApplicant
		}

		// Если документ с указанным id не был найден в applicantModel,
		// попробуйте удалить его из contractorModel
		const deletedContractor = await this.contractorModel
			.findByIdAndRemove(id)
			.exec()

		return deletedContractor
	}

	async subscribe(applicantId: string, contractorId: string): Promise<void> {
		const applicant = await this.applicantModel.findById(applicantId)
		const contractor = await this.contractorModel.findById(contractorId)

		if (applicant && contractor) {
			// Проверка, что подписчик - соискатель
			if (!applicant.isContractor) {
				applicant.subscriptions.push(new Types.ObjectId(contractorId))
				await applicant.save()

				// Добавить соискателя в список подписчиков подрядчика
				contractor.subscribers.push(new Types.ObjectId(applicantId))
				await contractor.save()
			} else {
				throw new Error('Only applicants can subscribe to contractors.')
			}
		}
	}

	async unsubscribe(applicantId: string, contractorId: string): Promise<void> {
		const applicant = await this.applicantModel.findById(applicantId)
		const contractor = await this.contractorModel.findById(contractorId)

		if (applicant && contractor) {
			// Удалить подписку соискателя
			applicant.subscriptions = applicant.subscriptions.filter(
				(id) => id.toString() !== contractorId
			)
			await applicant.save()

			// Удалить соискателя из списка подписчиков подрядчика
			contractor.subscribers = contractor.subscribers.filter(
				(id) => id.toString() !== applicantId
			)
			await contractor.save()
		}
	}

	async addSavedWork(userId: string, workId: string): Promise<void> {
		const user = await this.applicantModel.findById(userId)

		if (!user) {
			throw new Error('User not found')
		}

		const workObjectId = new Types.ObjectId(workId)

		user.saved.push(workObjectId)
		await user.save()
	}

	async removeSavedWork(userId: string, workId: string): Promise<void> {
		const user = await this.applicantModel.findById(userId)

		if (!user) {
			throw new Error('User not found')
		}

		const workObjectId = new Types.ObjectId(workId)

		// Находим индекс элемента в массиве saved
		const indexToRemove = user.saved.indexOf(workObjectId)

		if (indexToRemove !== -1) {
			// Используем splice для удаления элемента по индексу
			user.saved.splice(indexToRemove, 1)
			await user.save()
		}
	}
}
