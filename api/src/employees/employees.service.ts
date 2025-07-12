import { Injectable } from '@nestjs/common';
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

  async findAll() {
    return `This action returns all employees`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
