import {IsNotEmpty, IsString, Length, Validate} from "class-validator";
import {LENGTH_MESSAGE_2, NOT_EMPTY_MESSAGE, STRING_MESSAGE} from "../../common/constants";
import {IsTextConstraint} from "../../common/validators";

export class CreatePositionDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsTextConstraint)
    name: string;
}
