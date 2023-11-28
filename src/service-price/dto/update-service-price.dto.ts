import { PartialType } from '@nestjs/mapped-types';
import { CreateServicePriceDto } from './create-service-price.dto';

export class UpdateServicePriceDto extends PartialType(CreateServicePriceDto) {}
