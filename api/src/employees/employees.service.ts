import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {UserEntity} from "../user/entities/user.entity";
import {EmployeeEntity} from "./entities/employee.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class EmployeesService {
  constructor(
      @InjectRepository(EmployeeEntity)
      private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  getTableName(): string {
    return this.employeeRepository.metadata.tableName;
  }

  async create(cEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (last_name, first_name, middle_name, birth_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

    try {
      const result: EmployeeEntity = await this.employeeRepository.query(query, [
        cEmployeeDto.last_name, cEmployeeDto.first_name, cEmployeeDto.middle_name,
        cEmployeeDto.birth_date
      ]);

      console.log('Employee created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating Employee:', error);
      throw error;
    }
  }

  async findAll(options: { page: number; limit: number; sortField: string; order: string}):
      Promise<{ data: EmployeeEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY ${options.sortField} ${options.order} 
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: EmployeeEntity[] = await this.employeeRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }

  async findOne(id: number) {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: UserEntity[] = await this.employeeRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uEmployeeDto: UpdateEmployeeDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uEmployeeDto.last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      params.push(uEmployeeDto.last_name);
      paramIndex++;
    }
    if (uEmployeeDto.first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      params.push(uEmployeeDto.first_name);
      paramIndex++;
    }
    if (uEmployeeDto.middle_name !== undefined) {
      updateFields.push(`middle_name = $${paramIndex}`);
      params.push(uEmployeeDto.middle_name);
      paramIndex++;
    }
    if (uEmployeeDto.birth_date !== undefined) {
      updateFields.push(`birth_date = $${paramIndex}`);
      params.push(uEmployeeDto.birth_date.toString());
      paramIndex++;
    }
    if (uEmployeeDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uEmployeeDto.deleted_at.toString());
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
      const result: EmployeeEntity = await this.employeeRepository.query(query, params);
      console.log(`Employee with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating Employee:', error);
      throw error;
    }
  }
}
