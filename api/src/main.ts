import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DataSource} from "typeorm";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

import {CreateUserDto} from "./user/dto/create-user.dto";
import {UpdateUserDto} from "./user/dto/update-user.dto";
import {GetUserDto} from "./user/dto/get-user.dto";
import {GetDepartmentsDto} from "./departments/dto/get-departments.dto";
import {UpdateDepartmentDto} from "./departments/dto/update-department.dto";
import {CreateAuditHistoryDto} from "./audit_history/dto/create-audit_history.dto";
import {GetAuditHistoryDto} from "./audit_history/dto/get-audit_history.dto";
import {CreateEmployeeDto} from "./employees/dto/create-employee.dto";
import {UpdateEmployeeDto} from "./employees/dto/update-employee.dto";
import {GetEmployeeDto} from "./employees/dto/get-employee.dto";
import {CreateFileDto} from "./files/dto/create-file.dto";
import {UpdateFileDto} from "./files/dto/update-file.dto";
import {CreateOrganizationDto} from "./organizations/dto/create-organization.dto";
import {UpdateOrganizationDto} from "./organizations/dto/update-organization.dto";
import {GetOrganizationsDto} from "./organizations/dto/get-organizatios.dto";
import {CreatePassportInfoDto} from "./passport_info/dto/create-passport_info.dto";
import {UpdatePassportInfoDto} from "./passport_info/dto/update-passport_info.dto";
import {CreatePositionDto} from "./positions/dto/create-position.dto";
import {UpdatePositionDto} from "./positions/dto/update-position.dto";
import {GetPositionDto} from "./positions/dto/get-position.dto";
import {CreateRecruitOperDto} from "./recruit_opers/dto/create-recruit_oper.dto";
import {UpdateRecruitOperDto} from "./recruit_opers/dto/update-recruit_oper.dto";
import {GetRecruitOperDto} from "./recruit_opers/dto/get-recruit_oper.dto";
import {NestExpressApplication} from "@nestjs/platform-express";
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка для загрузки файлов
  app.useStaticAssets(join(__dirname, '..', 'passport_scan_files'), {
    prefix: '/passport_scans/',
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // автоматическая типизация в DTO перед валидацией
    whitelist: true, // отклоняет переменные которые не ожидались
    stopAtFirstError: true, // стоп при 1 ошибке
  }));

  const config = new DocumentBuilder()
    .setTitle("'REST-API for HR-Specialist' App")
    .setDescription("REST-API documentation для веб-приложения учета сотрудников в организациях.")
    .setContact("Contact with Developer", "https://t.me/sololvlup99",  "romanstin001@gmail.com")
    .setVersion("1.0.1")
    .build();

  const allDTOs = [
      CreateUserDto,UpdateUserDto,GetUserDto,
      GetDepartmentsDto, UpdateDepartmentDto, GetDepartmentsDto,
      CreateAuditHistoryDto, GetAuditHistoryDto,
      CreateEmployeeDto, UpdateEmployeeDto, GetEmployeeDto,
      CreateFileDto, UpdateFileDto,
      CreateOrganizationDto, UpdateOrganizationDto, GetOrganizationsDto,
      CreatePassportInfoDto, UpdatePassportInfoDto,
      CreatePositionDto, UpdatePositionDto, GetPositionDto,
      CreateRecruitOperDto, UpdateRecruitOperDto, GetRecruitOperDto,
  ];
  const document = SwaggerModule.createDocument(app,  config, {extraModels: allDTOs})
  SwaggerModule.setup('/docs', app,  document);

  // Сохраняем DataSource в глобальной области
  globalThis.dataSource = app.get(DataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
