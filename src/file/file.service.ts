import { Injectable } from '@nestjs/common'
import { ensureDir, writeFile } from 'fs-extra'
import { FileResponse } from './file.interface'
import { path } from 'app-root-path'

import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FileService {
	async saveFiles(
		files: Express.Multer.File[],
		folder: string = 'default'
	): Promise<FileResponse[]> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const res: FileResponse[] = await Promise.all(
			files.map(async (file) => {
			  const uniqueFileName = `${uuidv4()}_${file.originalname}`;
			  await writeFile(`${uploadFolder}/${uniqueFileName}`, file.buffer);
	  
			  return {
				url: `/uploads/${folder}/${uniqueFileName}`,
				name: uniqueFileName,
			  };
			})
		  );
		return res
	}
}