import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private userRepository: Repository<UserEntity>,
  ) {}

  getTableName(): string {
    return this.userRepository.metadata.tableName;
  }

  async create(cUserDto: CreateUserDto): Promise<UserEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (last_name, first_name, middle_name, email, login, password, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `;

    try {
      const result: UserEntity = await this.userRepository.query(query, [
          cUserDto.lastName, cUserDto.firstName, cUserDto.middleName,
          cUserDto.email, cUserDto.login, cUserDto.password, cUserDto.role
        ]);
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}"`;

    const result: UserEntity[] = await this.userRepository.query(query);
    if (!result || result.length <= 0) {
      throw new NotFoundException(`Users not found`);
    }
    return result;
  }

  async findOne(id: number): Promise<UserEntity> {
    const tableName = this.getTableName();
    const query = `SELECT * FROM "${tableName}" WHERE id = ${id}`;

    const result: UserEntity[] = await this.userRepository.query(query);
    if (!result[0]) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, uUserDto: UpdateUserDto): Promise<UserEntity> {
    const tableName = this.getTableName();

    // Строим динамический запрос
    const updateFields: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    // КОСТЫЛЬ В ВИДЕ ДИНАМИЧЕСКОГО СОЗДАНИЯ UPDATE SQL запроса
    // только для заполненных переменных
    if (uUserDto.lastName !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      params.push(uUserDto.lastName);
      paramIndex++;
    }
    if (uUserDto.firstName !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      params.push(uUserDto.firstName);
      paramIndex++;
    }
    if (uUserDto.middleName !== undefined) {
      updateFields.push(`middle_name = $${paramIndex}`);
      params.push(uUserDto.middleName);
      paramIndex++;
    }
    if (uUserDto.email !== undefined) {
      updateFields.push(`email = $${paramIndex}`);
      params.push(uUserDto.email);
      paramIndex++;
    }
    if (uUserDto.login !== undefined) {
      updateFields.push(`login = $${paramIndex}`);
      params.push(uUserDto.login);
      paramIndex++;
    }
    if (uUserDto.password !== undefined) {
      updateFields.push(`password = $${paramIndex}`);
      params.push(uUserDto.password);
      paramIndex++;
    }
    if (uUserDto.role !== undefined) {
      updateFields.push(`role = $${paramIndex}`);
      params.push(uUserDto.role);
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
      const result: UserEntity[] = await this.userRepository.query(query, params);
      console.log(`User with id ${id} updated successfully.`)
      return result[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async remove(id: number)  {
    const tableName = this.getTableName();
    const query = `DELETE FROM "${tableName}" WHERE id = ${id}`;
    try{
      const result: UserEntity[] = await this.userRepository.query(query);
      console.log(`User with id ${id} removed successfully.`)
      return true;
    } catch (error) {
      console.error('Error remove user:', error);
      throw error;
    }
  }
}
