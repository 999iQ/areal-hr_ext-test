import {IsInt, IsJSON, IsNotEmpty, IsString, Length, MaxLength} from "class-validator";
import {LENGTH_MESSAGE_2, NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE, NOT_JSON_MESSAGE,} from "../../common/constants";

export class CreatePassportInfoDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsJSON({message: NOT_JSON_MESSAGE})
    passport_data: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    employee_id: number;
}
