import {ConflictException, Injectable} from '@nestjs/common';
import { CreateAuditHistoryDto } from './dto/create-audit_history.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {AuditHistoryEntity} from "./entities/audit_history.entity";

@Injectable()
export class AuditHistoryService {
  constructor(
      @InjectRepository(AuditHistoryEntity)
      private auditRepository: Repository<AuditHistoryEntity>,
  ) {}

  getTableName(): string {
    return this.auditRepository.metadata.tableName;
  }

  async create(cAuditHistoryDto: CreateAuditHistoryDto): Promise<AuditHistoryEntity> {
    const tableName = this.getTableName();
    const query = `INSERT INTO "${tableName}" 
      (object_type, object_id, old_value, new_value, source_info, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `;

    try {
      const result: AuditHistoryEntity = await this.auditRepository.query(query, [
        cAuditHistoryDto.object_type, cAuditHistoryDto.object_id, cAuditHistoryDto.old_value,
        cAuditHistoryDto.new_value, cAuditHistoryDto.source_info, cAuditHistoryDto.user_id
      ]);
      console.log('Log created successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('violates foreign key constraint')) {
        throw new ConflictException('Body params: user_id is not correct, pls check it')
      } else {
        console.error('Error creating Log:', error);
        throw error;
      }

    }

  }

  async findAll(options: { page: number; limit: number; sortField: string; order: string}):
      Promise<{ data: AuditHistoryEntity[]; total: number; page: number; limit: number }> {
    const skip = (options.page - 1) * options.limit;
    const tableName = this.getTableName();
    const query = `
      SELECT * FROM "${tableName}" ORDER BY ${options.sortField} ${options.order} 
      LIMIT ${options.limit} OFFSET ${skip}
      `;

    const result: AuditHistoryEntity[] = await this.auditRepository.query(query);

    return {
      data: result,
      total: result.length,
      page: options.page,
      limit: options.limit,
    };
  }
}
