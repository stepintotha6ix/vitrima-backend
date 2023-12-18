import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	Query,
	Put,
	HttpCode,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import {
	CreateSubTypeDto,
	CreateWorkDto,
	CreateWorkTypeDto,
} from './dto/create-work.dto'
import { UpdateWorkDto, UpdateWorkTypeDto } from './dto/update-work.dto'
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { WorkService } from './work.service'
import { getWorkFilterDto } from './dto/get-work-filte.dto'

@Controller('work')
export class WorkController {
	constructor(private readonly workService: WorkService) {}

	@Post('create-sub-type')
	createSubType(@Body() workDto: CreateSubTypeDto) {
		return this.workService.createSubType(workDto)
	}

	@Get(`by-work-type/:workTypeId`)
	async byWorkType(@Param('workTypeId', IdValidationPipe) workTypeId) {
		return this.workService.byWorkType(workTypeId)
	}

	@Post('create-work-type')
	createWorkType(@Body() workDto: CreateWorkTypeDto) {
		return this.workService.createWorkType(workDto)
	}
	@Get('work-type/:id')
	async getWorkType(@Param('id') id: string) {
		const result = await this.workService.getWorkTypeById(id)
		return result
	}
	@Get('/work-types')
	async getAllWorkTypes(@Query('searchTerm') searchTerm?: string) {
		return this.workService.getAllWorkTypes(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@Put('update-work-type/:id')
	@HttpCode(200)
	@Auth()
	async updateWorkType(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateWorkTypeDto
	) {
		return this.workService.updateWorkType(id, dto)
	}

	@Post('create')
	create(@Body() workDto: CreateWorkDto) {
		return this.workService.createWork(workDto)
	}
	@Get(`by-contractor/:contractorId`)
	async byContractor(@Param('contractorId', IdValidationPipe) contractorId) {
		return this.workService.byContractor(contractorId)
	}

	@Get('get-work-by-work-type/:slug')
	getWorks(
		@Query('search') search: string,
		@Query('subTypes') subTypes: any,
		@Query('minPrice') minPrice: number,
		@Query('maxPrice') maxPrice: number,
		@Param('slug') slug: string
	): Promise<any[]> {
		const filterDto = { search, subTypes, minPrice, maxPrice }

		if (Object.values(filterDto).some(Boolean)) {
			return this.workService.getWorksWithFilters(slug, filterDto)
		} else {
			return this.workService.workByWorkType(slug)
		}
	}
	@Get('get-similar-works')
	async getSimilarWorks(@Query('subTypes') subTypes: any) {
		return this.workService.bySimilarSubType(subTypes)
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.workService.byId(id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.workService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateWorkDto
	) {
		return this.workService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async delete(
		@Param('id', IdValidationPipe) id: string,
		@Body() contractorId
	) {
		return this.workService.delete(id, contractorId)
	}
}
