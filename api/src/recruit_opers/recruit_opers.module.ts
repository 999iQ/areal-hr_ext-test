import { Module } from '@nestjs/common';
import { RecruitOpersService } from './recruit_opers.service';
import { RecruitOpersController } from './recruit_opers.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecruitOperEntity} from "./entities/recruit_oper.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RecruitOperEntity])],
  controllers: [RecruitOpersController],
  providers: [RecruitOpersService],
})
export class RecruitOpersModule {}
