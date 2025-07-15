import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdateFileDto extends PartialType(CreateFileDto) {
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;
}
