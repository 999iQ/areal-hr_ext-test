import { PartialType } from '@nestjs/mapped-types';
import { CreatePassportInfoDto } from './create-passport_info.dto';
import {IsOptional} from "class-validator";

export class UpdatePassportInfoDto extends PartialType(CreatePassportInfoDto) {
    // UpdateUserDto - наследует CreateUserDto все поля как необязательные
    @IsOptional()
    deleted_at?: Date;
}
