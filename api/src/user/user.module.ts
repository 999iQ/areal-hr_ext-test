import {Module, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "./entities/user.entity";
import { TypeOrmModule} from "@nestjs/typeorm";
import {IsEntityFieldValidator} from "../common/validators";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, IsEntityFieldValidator],
  exports: [IsEntityFieldValidator],
})
export class UserModule {}
