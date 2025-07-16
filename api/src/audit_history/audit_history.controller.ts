import {
  Controller,
  Get,
  Post,
  Body,
  Query, UsePipes, ValidationPipe
} from '@nestjs/common';
import { AuditHistoryService } from './audit_history.service';
import { CreateAuditHistoryDto } from './dto/create-audit_history.dto';
import {AuditHistoryEntity} from "./entities/audit_history.entity";
import {GetAuditHistoryDto} from "./dto/get-audit_history.dto";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('audit_history')
@ApiExtraModels(CreateAuditHistoryDto)
export class AuditHistoryController {
  constructor(private readonly auditHistoryService: AuditHistoryService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт объект лога с историей изменений в БД'})
  async create(@Body() createAuditHistoryDto: CreateAuditHistoryDto) {
    return this.auditHistoryService.create(createAuditHistoryDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает список логов'})
  async findAll(@Query() query: GetAuditHistoryDto): Promise<{ data: AuditHistoryEntity[]; total: number; page: number; limit: number }> {
    return this.auditHistoryService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'id', order: query.order || 'asc'},
    );
  }
}
