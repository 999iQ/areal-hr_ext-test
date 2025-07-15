import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {PositionEntity} from "./entities/position.entity";

@Injectable()
export class PositionsService {
  constructor(
      @InjectRepository(PositionEntity)
      private positionsRepository: Repository<PositionEntity>,
  ) {}

  getTableName(): string {
    return this.positionsRepository.metadata.tableName;
  }
  
  async create(cPositionDto: CreatePositionDto): Promise<PositionEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (name)
      VALUES ($1)
      RETURNING *;
      `;

    try {
      const result: PositionEntity = await this.positionsRepository.query(query, [
        cPositionDto.name
      ]);
      console.log('Position created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        // Обработка ошибки нарушения уникальности
        throw new ConflictException('Position with this name already exists');
      } else {
        console.error('Error creating Position:', error);
        throw error;
      }
    }
  }

  async findAll(options: { page: number; limit: number;}):
      Promise<{ data: PositionEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY name LIMIT ${options.limit} OFFSET ${skip}`;

    const result: PositionEntity[] = await this.positionsRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async findOne(id: number): Promise<PositionEntity> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: PositionEntity[] = await this.positionsRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uPositionDto: UpdatePositionDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uPositionDto.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(uPositionDto.name);
      paramIndex++;
    }
    if (uPositionDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uPositionDto.deleted_at.toString());
      paramIndex++;
    }

    // Если нет полей для обновления, просто выходим (или выбрасываем ошибку)
    if (updateFields.length === 0) {
      console.warn(`No fields to update for Position with id ${id}.`);
      throw new BadRequestException("No fields to update")
    }

    const query = `UPDATE "${tableName}" SET ${updateFields.join(', ')}
      WHERE id = ${id};
      `;

    try{
      const result: PositionEntity = await this.positionsRepository.query(query, params);
      console.log(`Position with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating Position:', error);
      throw error;
    }
  }
  
}
