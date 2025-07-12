import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTypeOrmConfig} from "./config/typeorm.config";
import { UserModule } from './user/user.module';
import { AuditHistoryModule } from './audit_history/audit_history.module';
import { EmployeesModule } from './employees/employees.module';

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
    EmployeesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
