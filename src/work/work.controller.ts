import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Put} from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

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

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.workService.bySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateWorkDto) {
    return this.workService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workService.remove(+id);
  }
}
