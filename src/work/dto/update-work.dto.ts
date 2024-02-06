import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';
import { IsString } from 'class-validator';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {}


