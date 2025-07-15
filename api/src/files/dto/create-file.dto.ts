import {IsInt, IsNotEmpty, IsString, Length, Validate} from "class-validator";
import {LENGTH_MESSAGE_2, NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE, STRING_MESSAGE} from "../../common/constants";
import {IsTextConstraint} from "../../common/validators";

export class CreateFileDto {
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Validate(IsTextConstraint)
    filename: string;

    @Length(2,1024, {message: 'Максимальная длина ссылки 1024 символа'})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    download_path: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    file_size: number;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    employee_id: number;
}
