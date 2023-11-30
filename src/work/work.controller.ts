
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Put, HttpCode, UsePipes, ValidationPipe} from '@nestjs/common';

import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private readonly workService:  WorkService) {}


  @Post('create')
  create(@Body() workDto: CreateWorkDto) {
    return this.workService.createWork(workDto);
  }
  @Get(`by-contractor/:contractorId`)
	async byContractor(@Param('contractorId', IdValidationPipe) contractorId) {
		return this.workService.byContractor(contractorId)
	}

  @Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.workService.getAll(searchTerm)
	}

  @Get(':id')
	
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.workService.byId(id)
	}

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.workService.bySlug(slug);
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
	async delete(@Param('id', IdValidationPipe) id: string, @Body() contractorId) {
		return this.workService.delete(id, contractorId)
	}
}
