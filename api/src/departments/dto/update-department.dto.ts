import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;
}
