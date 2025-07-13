import { Module } from '@nestjs/common';
import { PassportInfoService } from './passport_info.service';
import { PassportInfoController } from './passport_info.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassportInfoEntity} from "./entities/passport_info.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PassportInfoEntity])],
  controllers: [PassportInfoController],
  providers: [PassportInfoService],
})
export class PassportInfoModule {}
