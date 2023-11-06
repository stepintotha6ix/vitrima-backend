import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { ConfigModule, ConfigService } from '@nestjs/config'

import { JwtModule, JwtService } from '@nestjs/jwt'
import { getJwtDbConfig } from 'src/config/jwt.config'
import {
	ApplicantSchema,
	ContractorSchema,
	UserSchema,
} from 'src/user/Schemas/user.schema'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MongooseModule } from '@nestjs/mongoose'
import { HttpService } from 'src/http/http.service'

@Module({
	controllers: [AuthController],
	imports: [
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
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async () => ({
			  secret: process.env.JWT_SECRET,
			  
			}),
		}),
		
	],
	exports: [JwtStrategy],
	providers: [AuthService, JwtStrategy, JwtService, HttpService],
})
export class AuthModule {}
