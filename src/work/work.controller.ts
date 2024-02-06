import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Query,
	Put,
	HttpCode,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import {
	CreateBuildingTechniqueDto,
	CreateSubTypeDto,
	CreateWorkDto,
	CreateWorkTypeDto,
	
} from './dto/create-work.dto'
import { UpdateWorkDto } from './dto/update-work.dto'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { WorkService } from './work.service'

@Controller('work')
export class WorkController {
	constructor(private readonly workService: WorkService) {}

	@Post('create-sub-type')
	createSubType(@Body() workDto: CreateSubTypeDto) {
		return this.workService.createSubType(workDto)
	}
	@Post('create-building-technique')
	createBuildingTechnique(@Body() workDto: CreateBuildingTechniqueDto) {
		return this.workService.createBuildingTechnique(workDto)
	}
		@Get('building-technique')
	async getAllBuildingTechnique(@Query('searchTerm') searchTerm?: string) {
		return this.workService.getAllBuildingTechniques(searchTerm)
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
		@Body() dto: UpdateWorkDto
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
	async getWorks(
		@Query('search') search: string,
		@Query('subTypes') subTypes: any,
		@Query('minPrice') minPrice: number,
		@Query('maxPrice') maxPrice: number,
		@Query('contractorType') contractorType: any,
		@Query('location') location: any,
		@Param('slug') slug: string,
		@Query('_page') page: number,
		@Query('_limit') limit: number,
		@Query('buildingTechnique') buildingTechnique: string
	): Promise<any[]> {
		const filterDto = {
			search,
			subTypes,
			minPrice,
			maxPrice,
			contractorType,
			location,
			buildingTechnique
		}

		const filteredWorks = await this.workService.getWorksWithFilters(
			slug,
			filterDto,
			page,
			limit
		)

		return filteredWorks
	}

	@Get('get-similar-works')
	async getSimilarWorks(@Query('subTypes') subTypes: any) {
		return this.workService.bySimilarSubType(subTypes)
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.workService.byId(id)
	}

	@Get(`search/:slug`)
	async getWorksBySearch(@Query('searchTerm') searchTerm?: string) {
		
		const allWorks = await this.workService.getAll(searchTerm);
		const firstFiveWorks = allWorks.slice(0, 5);
		return firstFiveWorks;
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
	@UsePipes(new ValidationPipe())
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
