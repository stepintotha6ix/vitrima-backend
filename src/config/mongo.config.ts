import {ConfigService} from '@nestjs/config'

export const getMongoDbConfig = async (configService: ConfigService) => ({
    uri: configService.get('MONGO_URI')
})