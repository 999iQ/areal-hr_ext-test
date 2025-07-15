import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePassportInfoDto } from './dto/create-passport_info.dto';
import { UpdatePassportInfoDto } from './dto/update-passport_info.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {PassportInfoEntity} from "./entities/passport_info.entity";

@Injectable()
export class PassportInfoService {
  constructor(
      @InjectRepository(PassportInfoEntity)
      private passportRepository: Repository<PassportInfoEntity>,
  ) {}

  getTableName(): string {
    return this.passportRepository.metadata.tableName;
  }

  async create(cPassportDto: CreatePassportInfoDto): Promise<PassportInfoEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (passport_data, employee_id)
      VALUES ($1, $2)
      RETURNING *;
      `;

    try {
      const result: PassportInfoEntity = await this.passportRepository.query(query, [
        cPassportDto.passport_data, cPassportDto.employee_id
      ]);
      console.log('PassportInfo created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: employee_id is not correct, pls check it')
      } else {
        console.error('Error creating PassportInfo:', error);
        throw error;
      }
    }
  }

  async findOne(id: number): Promise<PassportInfoEntity> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: PassportInfoEntity[] = await this.passportRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`PassportInfo with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uPassportInfoDto: UpdatePassportInfoDto): Promise<boolean> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uPassportInfoDto.passport_data !== undefined) {
      updateFields.push(`passport_data = $${paramIndex}`);
      params.push(uPassportInfoDto.passport_data);
      paramIndex++;
    }
    if (uPassportInfoDto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex}`);
      params.push(uPassportInfoDto.deleted_at.toString());
      paramIndex++;
    }

    // Если нет полей для обновления, просто выходим (или выбрасываем ошибку)
    if (updateFields.length === 0) {
      console.warn(`No fields to update for PassportInfo with id ${id}.`);
      throw new BadRequestException("No fields to update")
    }

    const query = `UPDATE "${tableName}" SET ${updateFields.join(', ')}
      WHERE id = ${id};
      `;

    try{
      const result: PassportInfoEntity = await this.passportRepository.query(query, params);
      console.log(`PassportInfo with id ${id} updated successfully.`)
      return true;
    } catch (error) {
      console.error('Error updating PassportInfo:', error);
      throw error;
    }
  }
}
