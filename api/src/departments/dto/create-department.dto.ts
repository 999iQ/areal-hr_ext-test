import {IsInt, IsNotEmpty, IsOptional, IsString, Length, Validate} from "class-validator";
import {LENGTH_MESSAGE_2, NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE, STRING_MESSAGE} from "../../common/constants";
import {IsTitleConstraint} from "../../common/validators";

export class CreateDepartmentDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsTitleConstraint)
    name: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2, 1024, {message: 'Длина комментария превышает 1024 символа'})
    @Validate(IsTitleConstraint)
    @IsOptional()
    comment?: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    organization_id: number;

    @IsOptional()
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    parent_id?: number;
}
