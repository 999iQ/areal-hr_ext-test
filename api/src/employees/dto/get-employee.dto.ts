import {Type} from "class-transformer";
import {IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max} from "class-validator";
import {
    MAX_INT_MESSAGE,
    NOT_EMPTY_MESSAGE,
    NOT_INT_MESSAGE,
    NOT_POSITIVE_INT_MESSAGE,
    STRING_MESSAGE
} from "../../common/constants";
import {IsEntityField} from "../../common/validators";
import {EmployeeEntity} from "../entities/employee.entity";

export class GetEmployeeDto {
    @Type(() => Number)
    @IsInt({ message: NOT_INT_MESSAGE })
    @IsPositive({message: NOT_POSITIVE_INT_MESSAGE})
    @IsNotEmpty({ message: NOT_EMPTY_MESSAGE })
    page: number;

    @Type(() => Number)
    @IsInt({ message: NOT_INT_MESSAGE })
    @IsPositive({message: NOT_POSITIVE_INT_MESSAGE})
    @IsNotEmpty({ message: NOT_EMPTY_MESSAGE })
    @Max(10000, { message: MAX_INT_MESSAGE })
    limit: number;

    @IsString({message: STRING_MESSAGE})
    @IsOptional()
    @IsEntityField(EmployeeEntity) // проверяет что заданное поле есть у сущности
    sort?: string;

    @IsString({message: STRING_MESSAGE})
    @IsOptional()
    order?: 'asc' | 'desc' = 'asc';
}