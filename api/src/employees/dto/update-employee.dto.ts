import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {IsOptional} from "class-validator";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsOptional()
    deleted_at?: Date;
}
