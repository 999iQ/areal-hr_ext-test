import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import {IsDate, IsOptional} from "class-validator";
import {NOT_DATE_MESSAGE} from "../../common/constants";

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
    @IsOptional()
    @IsDate({message: NOT_DATE_MESSAGE})
    deleted_at?: Date;
}
