import { Module } from '@nestjs/common';
import { AuditHistoryService } from './audit_history.service';
import { AuditHistoryController } from './audit_history.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuditHistoryEntity} from "./entities/audit_history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuditHistoryEntity])],
  controllers: [AuditHistoryController],
  providers: [AuditHistoryService],
})
export class AuditHistoryModule {}
