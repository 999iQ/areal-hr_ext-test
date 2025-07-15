import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTypeOrmConfig} from "./config/typeorm.config";
import { UserModule } from './user/user.module';
import { AuditHistoryModule } from './audit_history/audit_history.module';
import { EmployeesModule } from './employees/employees.module';
import { PassportInfoModule } from './passport_info/passport_info.module';
import { FilesModule } from './files/files.module';
import { PositionsModule } from './positions/positions.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { RecruitOpersModule } from './recruit_opers/recruit_opers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService]
  }),
    UserModule,
    AuditHistoryModule,
    EmployeesModule,
    PassportInfoModule,
    FilesModule,
    PositionsModule,
    OrganizationsModule,
    DepartmentsModule,
    RecruitOpersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
