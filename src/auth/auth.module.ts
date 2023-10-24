import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { ConfigModule, ConfigService } from '@nestjs/config'

import { JwtModule } from '@nestjs/jwt'
import { getJwtDbConfig } from 'src/config/jwt.config'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from 'src/user/Schemas/user.model'
import { JwtStrategy } from './strategies/jwt.strategy'


@Module({
	controllers: [AuthController],
	imports: [
	  TypegooseModule.forFeature([
		{
		  typegooseClass: UserModel,
		  schemaOptions: {
			collection: 'User',
		  },
		},
	  ]),
	  ConfigModule,
	  JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: getJwtDbConfig
	  })
	],
	providers: [AuthService, JwtStrategy],
  })
  export class AuthModule {}