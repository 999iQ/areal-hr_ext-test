import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;
}
