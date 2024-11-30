import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { NullableType } from '../utils/types/nullable.type';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id);
  }

  findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    return this.fileRepository.findByIds(ids);
  }

  async create(createFileDto: CreateFileDto): Promise<FileType> {
    if (!createFileDto.path || typeof createFileDto.path !== 'string') {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          path: 'invalidPath',
        },
      });
    }

    const existingFile = await this.fileRepository.findByPath(
      createFileDto.path
    );    
    if (existingFile) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          path: 'fileAlreadyExists',
        },
      });
    }

    return this.fileRepository.create({
      path: createFileDto.path,
    });
  }
}
