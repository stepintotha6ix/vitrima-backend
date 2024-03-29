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

import { AuthService } from './auth/auth.service'
import { ApplicantSchema, ContractorSchema, UserSchema } from './user/Schemas/user.schema'
import { HttpService } from './http/http.service'
import { JwtService } from '@nestjs/jwt'
import { FileModule } from './file/file.module';
import { TagModule } from './tag/tag.module';
import { ServicePriceModule } from './service-price/service-price.module';
import { MessagesModule } from './message/messages.module'
import { ChatModule } from './chat/chat.module';
import { MailService } from './auth/mail.service'
import { MessageGateway } from './message/messages.gateway'
import { MessageService } from './message/messages.service'
import { ChatService } from './chat/chat.service'
import { MessageSchema } from './message/messages.model'
import { ChatSchema } from './chat/chat.model'

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
			{
				schema: MessageSchema,
				name: 'Message',
			},
			{
				schema: ChatSchema,
				name: 'Chat',
			}
			
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
		FileModule,
		TagModule,
		ServicePriceModule,
		MessagesModule,
		ChatModule,
		

	],
	controllers: [],
	providers: [AuthService, HttpService, JwtService, MailService, MessageGateway, MessageService,ChatService],
})
export class AppModule  {
	
}
