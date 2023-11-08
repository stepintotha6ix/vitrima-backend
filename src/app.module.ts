import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

import { getMongoDbConfig } from './config/mongo.config'
import { WorkModule } from './work/work.module'
import { MongooseModule } from '@nestjs/mongoose'
import { HttpModule } from './http/http.module'
import { tokenCheckMiddleware } from './middleware/tokenCheck.middleware'
import { AuthService } from './auth/auth.service'
import { ApplicantSchema, ContractorSchema, UserSchema } from './user/Schemas/user.schema'
import { HttpService } from './http/http.service'
import { JwtService } from '@nestjs/jwt'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forFeature([
			{
				schema: ContractorSchema,
				name: 'Contractor',
			},
			{
				schema: ApplicantSchema,
				name: 'Applicant',
			},
			
			{
				schema: UserSchema,
				name: 'User',
			},
		]),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoDbConfig,
		}),
		AuthModule,
		UserModule,
		WorkModule,
		HttpModule,
	],
	controllers: [],
	providers: [AuthService, HttpService, JwtService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(tokenCheckMiddleware)
			.forRoutes({ path: '*', method: RequestMethod.ALL })
	}
}
