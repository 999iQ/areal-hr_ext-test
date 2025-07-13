import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DataSource} from "typeorm";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // автоматическая типизация в DTO перед валидацией
    whitelist: true, // отклоняет переменные которые не ожидались
    stopAtFirstError: true, // стоп при 1 ошибке
  }));

  // Сохраняем DataSource в глобальной области
  globalThis.dataSource = app.get(DataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
