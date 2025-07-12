import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  BadGatewayException
} from '@nestjs/common';
import { AuditHistoryService } from './audit_history.service';
import { CreateAuditHistoryDto } from './dto/create-audit_history.dto';
import {AuditHistoryEntity} from "./entities/audit_history.entity";

@Controller('audit_history')
export class AuditHistoryController {
  constructor(private readonly auditHistoryService: AuditHistoryService) {}

  @Post()
  async create(@Body() createAuditHistoryDto: CreateAuditHistoryDto) {
    return this.auditHistoryService.create(createAuditHistoryDto);
  }

  @Get()
  async findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number = 1000,
  ): Promise<{ data: AuditHistoryEntity[]; total: number; page: number; limit: number }> {
    if (page < 1 || limit < 1) {
      throw new BadGatewayException(`Page and limit values must be greater than 0`);
    }
    return this.auditHistoryService.findAll({limit: limit, page: page});
  }
}
