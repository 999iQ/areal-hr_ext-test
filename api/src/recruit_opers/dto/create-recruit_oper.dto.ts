import {IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";
import {NOT_DATE_MESSAGE, NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE, NOT_POSITIVE_INT_MESSAGE} from "../../common/constants";

export class CreateRecruitOperDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsNumber()
    @IsPositive({message: NOT_POSITIVE_INT_MESSAGE})
    salary: number;

    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    hire_date?: Date = new Date();

    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    dismissal_date?: Date;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    employee_id: number;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    department_id: number;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    position_id : number;

}
