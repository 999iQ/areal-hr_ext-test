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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {EmployeeEntity} from "./entities/employee.entity";
import {GetEmployeeDto} from "./dto/get-employee.dto";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('employees')
@ApiExtraModels(CreateEmployeeDto)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт нового сотрудника'})
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает сортированный список сотрудников'})
  async findAll(@Query() query: GetEmployeeDto): Promise<{ data: EmployeeEntity[]; total: number; page: number; limit: number }> {
    return this.employeesService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'id', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает сотрудника по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные сотрудника по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает сотрудника как удаленного по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateEmployeeDto = new UpdateEmployeeDto()
    updateEmployeeDto.deleted_at = new Date();
    return this.employeesService.update(+id, updateEmployeeDto);
  }
}
