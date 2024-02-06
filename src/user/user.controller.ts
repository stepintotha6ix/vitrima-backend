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
	Put,
	UsePipes,
	ValidationPipe,
	Req,
	Res,
	NotFoundException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDec } from './decorators/user.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from './Schemas/user.schema'

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
	@Get('/:id')
	async getUserById(@Param('id', IdValidationPipe) id: string) {
		return this.userService.getUserById(id)
	}

	@Get('count/contractors')
	async getCountContractors() {
		return this.userService.getCountContractors()
	}

	@Get('count/applicants')
	async getCountApplicants() {
		return this.userService.getCountApplicants()
	}

	@Get('profile/takeinfouser')
	@Auth()
	async getProfile(@UserDec('_id') _id: string) {
		return this.userService.getUserById(_id)
	}

	@Get('activate/:link')
  async activate(@Param('link') activationLink: string, @Res() res: Response) {
      return  await this.userService.activate(activationLink)
  }

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@UserDec('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	//@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.delete(id)
	}

	@Post(':applicantId/subscribe/:contractorId')
  async subscribe(@Param('applicantId') applicantId: string, @Param('contractorId') contractorId: string): Promise<void> {
    await this.userService.subscribe(applicantId, contractorId);
  }

  @Post(':applicantId/unsubscribe/:contractorId')
  async unsubscribe(@Param('applicantId') applicantId: string, @Param('contractorId') contractorId: string): Promise<void> {
    await this.userService.unsubscribe(applicantId, contractorId);
  }
  

  @Post('add-saved-work/:applicantId/:workId')
  async addSavedWork(@Param('applicantId') applicantId: string, @Param('workId') workId: string): Promise<void> {
    await this.userService.addSavedWork(applicantId, workId);
  }
  @Post('remove-saved-work/:applicantId/:workId')
  async removeSavedWork(@Param('applicantId') applicantId: string, @Param('workId') workId: string): Promise<void> {
    await this.userService.removeSavedWork(applicantId, workId);
  }
}
