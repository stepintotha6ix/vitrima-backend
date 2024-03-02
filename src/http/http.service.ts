import { BadRequestException, UnauthorizedException } from '@nestjs/common'
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
	async validateInnForIP(inn: string) {
		const response = await axios.post(url, { query: inn }, { headers: headers })

		if (response.data === null || response.data === undefined) {
			throw new UnauthorizedException('Данный инн не найден')
		}
		const suggestions = response.data.suggestions

		// Извлечение значения type из каждого элемента массива suggestions
		const types = suggestions.map((suggestion) => suggestion.data.type)

		// Вывод в консоль или использование types в вашем коде


		return types[0]
	}
	async validateInnForSE(inn: string, date?: Date) {
		try {
		  if (!date) {
			date = new Date();
		  }
		  const dateStr = date.toISOString().substring(0, 10);
		  const url = 'https://statusnpd.nalog.ru/api/v1/tracker/taxpayer_status';
		  const data = {
			inn: inn,
			requestDate: dateStr,
		  };
	
		  const response = await fetch(url, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		  });
		  if (response.ok) {
			const result = await response.json();
			return result;
		  } else {
			const errorData = await response.json();
			throw new BadRequestException(`Указан некорректный ИНН`, errorData);
		  }
		} catch (error) {
		  // Handle errors, you might want to log or do something specific here
		  throw new BadRequestException( `${error.message}`);
		}
	  }
	
}

