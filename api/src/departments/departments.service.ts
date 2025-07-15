import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {DepartmentEntity} from "./entities/department.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {OrganizationEntity} from "../organizations/entities/organization.entity";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class DepartmentsService {
  constructor(
      @InjectRepository(DepartmentEntity)
      private depRepository: Repository<DepartmentEntity>,
  ) {}

  getTableName(): string {
    return this.depRepository.metadata.tableName;
  }

  async create(cDepartmentDto: CreateDepartmentDto):Promise<DepartmentEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (name, comment, organization_id, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

    try {
      const result: DepartmentEntity = await this.depRepository.query(query, [
        cDepartmentDto.name, cDepartmentDto.comment, cDepartmentDto.organization_id, cDepartmentDto.parent_id
      ]);
      console.log('Department created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        // Обработка ошибки нарушения уникальности
        throw new ConflictException('User with this Email or Login already exists');
      } else if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: organization_id or parent_id is not correct, pls check it')
      } else {
        console.error('Error creating Department:', error);
        throw error;
      }
    }
  }

  async findAll(options: { page: number; limit: number;}):
      Promise<{ data: DepartmentEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY name
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: DepartmentEntity[] = await this.depRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async findOne(id: number): Promise <DepartmentEntity> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: DepartmentEntity[] = await this.depRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`Departments with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uDepartmentDto: UpdateDepartmentDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uDepartmentDto.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(uDepartmentDto.name);
      paramIndex++;
    }
    if (uDepartmentDto.comment !== undefined) {
      updateFields.push(`comment = $${paramIndex}`);
      params.push(uDepartmentDto.comment);
      paramIndex++;
    }
    if (uDepartmentDto.organization_id !== undefined) {
      updateFields.push(`organization_id = $${paramIndex}`);
      params.push(uDepartmentDto.organization_id.toString());
      paramIndex++;
    }
    if (uDepartmentDto.parent_id !== undefined) {
      updateFields.push(`parent_id = $${paramIndex}`);
      params.push(uDepartmentDto.parent_id.toString());
      paramIndex++;
    }
    if (uDepartmentDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uDepartmentDto.deleted_at.toString());
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
      const result: DepartmentEntity = await this.depRepository.query(query, params);
      console.log(`Department with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating Department:', error);
      throw error;
    }
  }
}
