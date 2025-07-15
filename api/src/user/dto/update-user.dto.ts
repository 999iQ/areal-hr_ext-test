import { PartialType } from '@nestjs/mapped-types';
import {
    CreateUserDto
} from './create-user.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // UpdateUserDto - наследует CreateUserDto все поля как необязательные
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;

}
