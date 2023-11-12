import {
	Controller,
	Post,
	UseGuards,
	UseInterceptors,
	Query,
	UploadedFile,
} from '@nestjs/common'
import { FileService } from './file.service'
import { AuthCheckContractor } from 'src/auth/guards/authCheck.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileResponse } from './file.interface'

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	): Promise<FileResponse[]> {
		return this.fileService.saveFiles([file], folder)
	}
}
  