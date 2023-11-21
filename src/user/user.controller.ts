import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	HttpCode,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDec } from './decorators/user.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	

	@Get(`:id/works`)
	getContractorWorks(@Param('_id') id: string) {
		return this.userService.getContractorWorks(id)
	}


	// @Get('contractor/profile')
	// async getContractorProfile(@UserDec('_id') _id: string) {
	// 	return this.userService.contractorById(_id)
	// }
	// @Get('applicant/profile')
	// async getApplicantProfile(@UserDec('_id') _id: string) {
	// 	return this.userService.applicantById(_id)
	// }

	
	@Get()
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Get('contractor/:id')
	
	async getContractor(@Param('id', IdValidationPipe) id: string) {
		return this.userService.contractorById(id)
	}
	@Get('applicant/:id')
	
	async getApplicant(@Param('id', IdValidationPipe) id: string) {
		return this.userService.applicantById(id)
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
		return this.userService.updateProfile(id, updateUserDto)
	}

	@Delete(':id')
	@HttpCode(200)
	//@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.delete(id)
	}

}
