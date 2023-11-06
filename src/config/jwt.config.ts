import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const getJwtDbConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get('JWT_SECRET'),
	signOptions: {
		expiresIn: configService.get('JWT_EXPIRATION_TIME'), // Получите время жизни токена из вашего конфигурационного файла
	},
})
