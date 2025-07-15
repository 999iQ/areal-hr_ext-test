import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {FilesEntity} from "./entities/file.entity";

@Injectable()
export class FilesService {
  constructor(
      @InjectRepository(FilesEntity)
      private filesRepository: Repository<FilesEntity>,
  ) {}

  getTableName(): string {
    return this.filesRepository.metadata.tableName;
  }

  async create(cFileDto: CreateFileDto): Promise<FilesEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (filename, download_path, file_size, employee_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

    try {
      const result: FilesEntity = await this.filesRepository.query(query, [
        cFileDto.filename, cFileDto.download_path, cFileDto.file_size,
        cFileDto.employee_id
      ]);
      console.log('File created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: employee_id is not correct, pls check it')
      } else {
        console.error('Error creating File:', error);
        throw error;
      }

    }
  }


  async findOne(id: number) {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: FilesEntity[] = await this.filesRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uFileDto: UpdateFileDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uFileDto.filename !== undefined) {
      updateFields.push(`filename = $${paramIndex}`);
      params.push(uFileDto.filename);
      paramIndex++;
    }
    if (uFileDto.download_path !== undefined) {
      updateFields.push(`download_path = $${paramIndex}`);
      params.push(uFileDto.download_path);
      paramIndex++;
    }
    if (uFileDto.file_size !== undefined) {
      updateFields.push(`file_size = $${paramIndex}`);
      params.push(uFileDto.file_size.toString());
      paramIndex++;
    }
    if (uFileDto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex}`);
      params.push(uFileDto.employee_id.toString());
      paramIndex++;
    }
    if (uFileDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uFileDto.deleted_at.toString());
      paramIndex++;
    }

    // Если нет полей для обновления, просто выходим (или выбрасываем ошибку)
    if (updateFields.length === 0) {
      console.warn(`No fields to update for File with id ${id}.`);
      throw new BadRequestException("No fields to update")
    }

    const query = `UPDATE "${tableName}" SET ${updateFields.join(', ')}
      WHERE id = ${id};
      `;

    try{
      const result: FilesEntity = await this.filesRepository.query(query, params);
      console.log(`File with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating File:', error);
      throw error;
    }
  }
}
