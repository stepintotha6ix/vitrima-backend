require('dotenv').config();

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import { PassportStrategy } from '@nestjs/passport'
import { Model } from 'mongoose'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { Applicant, Contractor, User } from 'src/user/Schemas/user.schema'

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
	
	constructor(
		configService: ConfigService,
		@InjectModel(Applicant.name) private readonly applicantModel,
		@InjectModel(Contractor.name) private readonly contractorModel
	) {
		super({
			
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET')
		})
	}

	async validate( _id: string) {
		
		const applicant = await this.applicantModel.findById(_id).exec();
		if (applicant) {
		  return applicant; 
		}
		const contractor = await this.contractorModel.findById(_id).exec();
		if (contractor) {
		  return contractor;
		}
		return null;
	  }
}
