import { PartialType } from '@nestjs/mapped-types';
import { CreateHttpDto } from './create-http.dto';

export class UpdateHttpDto extends PartialType(CreateHttpDto) {}
