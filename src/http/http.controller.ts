import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from './http.service';
import { CreateHttpDto } from './dto/create-http.dto';
import { UpdateHttpDto } from './dto/update-http.dto';

@Controller('http')
export class HttpController {
  constructor(private readonly httpService: HttpService) {}

}
