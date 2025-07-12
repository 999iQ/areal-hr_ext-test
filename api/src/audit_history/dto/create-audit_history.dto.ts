import {IsInt, IsNotEmpty, IsString} from "class-validator";
import {NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE, STRING_MESSAGE} from "../../common/constants";

export class CreateAuditHistoryDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    object_type: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    object_id: number;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    old_value: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    new_value: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    source_info: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    user_id: number;
}
