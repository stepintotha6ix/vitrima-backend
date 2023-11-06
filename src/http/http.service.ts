import axios, { AxiosError } from 'axios'

export class HttpService {
	// Асинхронный метод для валидации ИНН
	async validateInn(
		inn: string
	): Promise<{ success: boolean; errorMessage?: string }> {
		try {
			const response = await axios.get(
				`https://api-fns.ru/api/egr?req=${inn}&key=4874d4ea1b892429e9f909aaa3025d294a1ca8b7`
			)
				console.log(response.data.items)
			if (response.data.items === 0) {
				return {
					success: false,
					errorMessage: 'Неверный формат данных от API ФНС',
				}
			} else {
				return { success: true }
			}
		} catch (error) {
			console.error('Ошибка при запросе к API ФНС:', error)

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError
				return { success: false, errorMessage: axiosError.message }
			} else {
				return {
					success: false,
					errorMessage: 'Произошла ошибка при запросе к API ФНС',
				}
			}
		}
	}
}
