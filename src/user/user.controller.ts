import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDec } from './decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async GetProfile(@UserDec('_id') _id: string) {
		return this.userService.contractorById(_id)
	}

	@Get(`:id/works`)
	getContractorWorks(@Param('_id') id: string) {
		return this.userService.getContractorWorks(id)
	}

	@Get()
	findAll() {
		return this.userService.findAll()
	}

	

	@Get('count/contractors')
	async getCountContractors() {
		return this.userService.getCountContractors()
	}

	@Get('count/applicants')
	async getCountApplicants() {
		return this.userService.getCountApplicants()
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id)
	}
}
