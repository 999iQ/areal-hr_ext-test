import { PartialType } from '@nestjs/mapped-types';
import { CreatePassportInfoDto } from './create-passport_info.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdatePassportInfoDto extends PartialType(CreatePassportInfoDto) {
    // UpdateUserDto - наследует CreateUserDto все поля как необязательные
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;
}
