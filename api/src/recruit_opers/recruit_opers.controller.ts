import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe, Query
} from '@nestjs/common';
import { RecruitOpersService } from './recruit_opers.service';
import { CreateRecruitOperDto } from './dto/create-recruit_oper.dto';
import { UpdateRecruitOperDto } from './dto/update-recruit_oper.dto';
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {GetUserDto} from "../user/dto/get-user.dto";
import {UserEntity} from "../user/entities/user.entity";
import {GetRecruitOperDto} from "./dto/get-recruit_oper.dto";
import {RecruitOperEntity} from "./entities/recruit_oper.entity";

@Controller('recruit-opers')
export class RecruitOpersController {
  constructor(private readonly recruitOpersService: RecruitOpersService) {}

  @Post()
  async create(@Body() createRecruitOperDto: CreateRecruitOperDto) {
    return this.recruitOpersService.create(createRecruitOperDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async findAll(@Query() query: GetRecruitOperDto): Promise<{ data: RecruitOperEntity[]; total: number; page: number; limit: number }> {
    return this.recruitOpersService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'salary', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.recruitOpersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateRecruitOperDto: UpdateRecruitOperDto) {
    return this.recruitOpersService.update(+id, updateRecruitOperDto);
  }

}
