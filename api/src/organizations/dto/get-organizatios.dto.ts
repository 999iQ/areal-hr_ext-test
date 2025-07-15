import {Type} from "class-transformer";
import {IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max} from "class-validator";
import {
    MAX_INT_MESSAGE,
    NOT_EMPTY_MESSAGE,
    NOT_INT_MESSAGE,
    NOT_POSITIVE_INT_MESSAGE
} from "../../common/constants";

export class GetOrganizationsDto {
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
}