import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitOperDto } from './create-recruit_oper.dto';

export class UpdateRecruitOperDto extends PartialType(CreateRecruitOperDto) {}
