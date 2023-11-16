import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService:  WorkService) {}


  @Post('create')
  create(@Body() workDto: CreateWorkDto) {
    return this.workService.createWork(workDto);
  }

  @Get()
  findAll() {
    return this.workService.findAll();
  }

  @Get(':id')
  findBySlug(@Param('slug') slug: string) {
    return this.workService.bySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateWorkDto) {
    return this.workService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workService.remove(+id);
  }
}
