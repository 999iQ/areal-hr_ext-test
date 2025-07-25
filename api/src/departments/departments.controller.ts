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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {GetOrganizationsDto} from "../organizations/dto/get-organizatios.dto";
import {OrganizationEntity} from "../organizations/entities/organization.entity";
import {GetDepartmentsDto} from "./dto/get-departments.dto";
import {DepartmentEntity} from "./entities/department.entity";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('departments')
@ApiExtraModels(CreateDepartmentDto)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт отдел'})
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает сортированный список отделов'})
  async findAll(@Query() query: GetDepartmentsDto): Promise<{ data: DepartmentEntity[]; total: number;
      page: number; limit: number }> {
    return this.departmentsService.findAll(
        {page: query.page, limit: query.limit},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает отдел по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные отдела по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает отдел как удаленный по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateDepartmentDto = new UpdateDepartmentDto()
    updateDepartmentDto.deleted_at = new Date();
    return this.departmentsService.update(+id, updateDepartmentDto);
  }
}
