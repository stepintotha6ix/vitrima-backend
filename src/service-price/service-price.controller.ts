import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, ValidationPipe, UsePipes } from '@nestjs/common';
import { ServicePriceService } from './service-price.service';
import { CreateServicePriceDto } from './dto/create-service-price.dto';
import { UpdateServicePriceDto } from './dto/update-service-price.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('service-price')
export class ServicePriceController {
  constructor(private readonly servicePriceService: ServicePriceService) {}

  @UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	
	async create(@Body() servicePriceDto: CreateServicePriceDto) {
		return this.servicePriceService.create(servicePriceDto)
	}

  @Get(`by-contractor/:contractorId`)
	async byContractor(@Param('contractorId', IdValidationPipe) contractorId) {
		return this.servicePriceService.byContractor(contractorId)
	}

  @Get()
  findAll() {
    return this.servicePriceService.findAll();
  }

  @Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.servicePriceService.byId(id)
	}

  @UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateServicePriceDto
	) {
		return this.servicePriceService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.servicePriceService.delete(id)
	}
}
