import { UnauthorizedException } from '@nestjs/common'
import axios, { AxiosError } from 'axios'

const token = '4a9e155a8d8b3989ac9f4a5e58269c44c65f049b'
const url =
	'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'

const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
	Authorization: 'Token ' + token,
}

export class HttpService {
	// Асинхронный метод для валидации ИНН
	async validateInn(inn: string) {
		const response = await axios.post(url, { query: inn }, { headers: headers })
		console.log(response.data)
		if (response.data === null ||response.data === undefined) {
			throw new UnauthorizedException('Данный инн не найден')
		}
		return response
		
	}
}
