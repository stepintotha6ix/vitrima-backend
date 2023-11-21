import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
  UsePipes,
  Put,
  ValidationPipe,
  Query,
} from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('tag')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	//@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	//@Auth('admin')
	async create() {
		return this.tagService.createTag()
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.tagService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.tagService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.tagService.byId(id)
	}

	//@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	//@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTagDto
	) {
		return this.tagService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	//@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.tagService.delete(id)
	}
}
