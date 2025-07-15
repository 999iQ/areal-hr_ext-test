import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {OrganizationEntity} from "./entities/organization.entity";

@Injectable()
export class OrganizationsService {
  constructor(
      @InjectRepository(OrganizationEntity)
      private orgRepository: Repository<OrganizationEntity>,
  ) {}

  getTableName(): string {
    return this.orgRepository.metadata.tableName;
  }
  
  async create(cOrganizationDto: CreateOrganizationDto): Promise<OrganizationEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (name, comment)
      VALUES ($1, $2)
      RETURNING *;
      `;

    try {
      const result: OrganizationEntity = await this.orgRepository.query(query, [
        cOrganizationDto.name, cOrganizationDto.comment
      ]);
      console.log('Organization created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        // Обработка ошибки нарушения уникальности
        throw new ConflictException('Organization with this name already exists');
      } else if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: employee_id is not correct, pls check it')
      } else {
        console.error('Error creating Organization:', error);
        throw error;
      }
    }
  }

  async findAll(options: { page: number; limit: number;}):
      Promise<{ data: OrganizationEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY name
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: OrganizationEntity[] = await this.orgRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async findOne(id: number):Promise<OrganizationEntity> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: OrganizationEntity[] = await this.orgRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uOrganizationDto: UpdateOrganizationDto):Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uOrganizationDto.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(uOrganizationDto.name);
      paramIndex++;
    }
    if (uOrganizationDto.comment !== undefined) {
      updateFields.push(`comment = $${paramIndex}`);
      params.push(uOrganizationDto.comment);
      paramIndex++;
    }
    if (uOrganizationDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uOrganizationDto.deleted_at.toString());
      paramIndex++;
    }

    // Если нет полей для обновления, просто выходим (или выбрасываем ошибку)
    if (updateFields.length === 0) {
      console.warn(`No fields to update for Organization with id ${id}.`);
      throw new BadRequestException("No fields to update")
    }

    const query = `UPDATE "${tableName}" SET ${updateFields.join(', ')}
      WHERE id = ${id};
      `;

    try{
      const result: OrganizationEntity = await this.orgRepository.query(query, params);
      console.log(`Organization with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating Organization:', error);
      throw error;
    }
  }
}
