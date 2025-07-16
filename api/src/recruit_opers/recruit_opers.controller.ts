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
import {GetRecruitOperDto} from "./dto/get-recruit_oper.dto";
import {RecruitOperEntity} from "./entities/recruit_oper.entity";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('recruit-opers')
@ApiExtraModels(CreateRecruitOperDto)
export class RecruitOpersController {
  constructor(private readonly recruitOpersService: RecruitOpersService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт новую связь сотрудника и отдела'})
  async create(@Body() createRecruitOperDto: CreateRecruitOperDto) {
    return this.recruitOpersService.create(createRecruitOperDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает все связи сотрудников с отдела'})
  async findAll(@Query() query: GetRecruitOperDto): Promise<{ data: RecruitOperEntity[]; total: number; page: number; limit: number }> {
    return this.recruitOpersService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'salary', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает связь сотрудника и отдела по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.recruitOpersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные связи сотрудника и отдела по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateRecruitOperDto: UpdateRecruitOperDto) {
    return this.recruitOpersService.update(+id, updateRecruitOperDto);
  }

}
