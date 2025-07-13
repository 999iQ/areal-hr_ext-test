import {IsDate, IsNotEmpty, IsOptional, IsString, Length, Validate} from "class-validator";
import {LENGTH_MESSAGE_2, NOT_DATE_MESSAGE, NOT_EMPTY_MESSAGE, STRING_MESSAGE} from "../../common/constants";
import {IsTextConstraint} from "../../common/validators";


export class CreateEmployeeDto {
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Validate(IsTextConstraint)
    last_name: string;

    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Validate(IsTextConstraint)
    first_name: string;

    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Validate(IsTextConstraint)
    middle_name: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    birth_date?: Date;
}
