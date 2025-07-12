import { PartialType } from '@nestjs/mapped-types';
import {
    CreateUserDto
} from './create-user.dto';
import {IsOptional} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // UpdateUserDto - наследует CreateUserDto все поля как необязательные
    @IsOptional()
    deleted_at?: Date;

}
