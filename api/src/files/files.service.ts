import {BadRequestException, ConflictException, Injectable, NotFoundException, StreamableFile} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {FilesEntity} from "./entities/file.entity";
import { promises as fs } from 'fs';
import * as path from "path";
import {UserEntity} from "../user/entities/user.entity";
import {UpdateFileDto} from "./dto/update-file.dto";
import { stat } from 'fs/promises';

@Injectable()
export class FilesService {
  private readonly PASSPORT_SCAN_DIR = 'passport_scan_files';

  constructor(
      @InjectRepository(FilesEntity)
      private filesRepository: Repository<FilesEntity>,
  ) {}

  private getTableName(): string {
    return this.filesRepository.metadata.tableName;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, {recursive: true});
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async create(file: Express.Multer.File, employee_id: number): Promise<FilesEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (filename, download_path, file_size, employee_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

    if (file.mimetype !== 'application/pdf') {
      throw new ConflictException('Only PDF files are allowed');
    }

    // create dir if it is not exist
    await this.ensureDirectoryExists(this.PASSPORT_SCAN_DIR);

    const filename = `passport_${employee_id}_${Date.now()}.pdf`;
    const filePath = path.join(this.PASSPORT_SCAN_DIR, filename);

    try {
      await fs.writeFile(filePath, file.buffer); // local save
      const result: FilesEntity = await this.filesRepository.query(query, [
        filename, filePath, file.size, employee_id
      ]);
      console.log('File download successfully:', result);
      return result;
    } catch (error) {
      await fs.unlink(filePath).catch(console.error); // del file
      if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body param: employee_id is not correct, pls check it')
      } else {
        console.error('Error download File:', error);
        throw error;
      }
    }
  }

  async findAll(options: { page: number; limit: number; sortField: string; order: string}):
      Promise<{ data: FilesEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY ${options.sortField} ${options.order} 
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: FilesEntity[] = await this.filesRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async update(id: number, uFileDto: UpdateFileDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uFileDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uFileDto.deleted_at.toString());
      paramIndex++;
    }

    // Если нет полей для обновления, просто выходим (или выбрасываем ошибку)
    if (updateFields.length === 0) {
      console.warn(`No fields to update for user with id ${id}.`);
      throw new BadRequestException("No fields to update")
    }

    const query = `UPDATE "${tableName}" SET ${updateFields.join(', ')}
      WHERE id = ${id};
      `;

    try{
      const result: UserEntity = await this.filesRepository.query(query, params);
      console.log(`File with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating File:', error);
      throw error;
    }
  }


  async findOne(id: number): Promise<{
    filename: string;
    download_path: string;
    file_size: number; }>
  {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = $1`;

    const result: FilesEntity[] = await this.filesRepository.query(query, [id]);

    if (!result[0]) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    const filePath = result[0].download_path;

    try {
      await stat(filePath);
      return {
        filename: result[0].filename,
        download_path: filePath,
        file_size: result[0].file_size
      };
    } catch {
      throw new NotFoundException(`PDF file not found at path: ${filePath}`);
    }
  }

}
