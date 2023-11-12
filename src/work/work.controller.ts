import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService:  WorkService) {}
  @UseGuards(AuthCheckContractor)
  @Post('create')
  create(@Body() createJobDto: CreateWorkDto) {
    return this.workService.createWork(createJobDto);
  }

  @Get()
  findAll() {
    return this.workService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workService.findOne(+id);
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
