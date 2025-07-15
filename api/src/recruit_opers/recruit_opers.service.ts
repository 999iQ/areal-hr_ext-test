import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateRecruitOperDto } from './dto/create-recruit_oper.dto';
import { UpdateRecruitOperDto } from './dto/update-recruit_oper.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {RecruitOperEntity} from "./entities/recruit_oper.entity";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class RecruitOpersService {
  constructor(
      @InjectRepository(RecruitOperEntity)
      private recOperRepository: Repository<RecruitOperEntity>,
  ) {}

  getTableName(): string {
    return this.recOperRepository.metadata.tableName;
  }

  async create(cRecruitOperDto: CreateRecruitOperDto) {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (salary, hire_date, dismissal_date, employee_id, department_id, position_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `;

    try {
      const result: RecruitOperEntity = await this.recOperRepository.query(query, [
        cRecruitOperDto.salary, cRecruitOperDto.hire_date, cRecruitOperDto.dismissal_date,
        cRecruitOperDto.employee_id, cRecruitOperDto.department_id, cRecruitOperDto.position_id
      ]);
      console.log('Recruit_Operation created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        // Обработка ошибки нарушения уникальности
        throw new ConflictException('Recruit_Operation with this Email or Login already exists');
      } else if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: employee_id or department_id or position_id is not correct, pls check it')
      } else {
        console.error('Error creating Recruit_Operation:', error);
        throw error;
      }

    }
  }

  async findAll(options: { page: number; limit: number; sortField: string; order: string}):
      Promise<{ data: RecruitOperEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY ${options.sortField} ${options.order} 
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: RecruitOperEntity[] = await this.recOperRepository.query(query);

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

    const result: RecruitOperEntity[] = await this.recOperRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`Recruit_Operation with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uRecruitOperDto: UpdateRecruitOperDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uRecruitOperDto.salary !== undefined) {
      updateFields.push(`salary = $${paramIndex}`);
      params.push(uRecruitOperDto.salary.toString());
      paramIndex++;
    }
    if (uRecruitOperDto.hire_date !== undefined) {
      updateFields.push(`hire_date = $${paramIndex}`);
      params.push(uRecruitOperDto.hire_date.toString());
      paramIndex++;
    }
    if (uRecruitOperDto.dismissal_date !== undefined) {
      updateFields.push(`dismissal_date = $${paramIndex}`);
      params.push(uRecruitOperDto.dismissal_date.toString());
      paramIndex++;
    }
    if (uRecruitOperDto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex}`);
      params.push(uRecruitOperDto.employee_id.toString());
      paramIndex++;
    }
    if (uRecruitOperDto.department_id !== undefined) {
      updateFields.push(`department_id = $${paramIndex}`);
      params.push(uRecruitOperDto.department_id.toString());
      paramIndex++;
    }
    if (uRecruitOperDto.position_id !== undefined) {
      updateFields.push(`position_id = $${paramIndex}`);
      params.push(uRecruitOperDto.position_id.toString());
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
      const result: RecruitOperEntity = await this.recOperRepository.query(query, params);
      console.log(`Recruit_Operation with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating Recruit_Operation:', error);
      throw error;
    }
  }
  
}
