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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {GetPositionDto} from "./dto/get-position.dto";
import {PositionEntity} from "./entities/position.entity";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('positions')
@ApiExtraModels(PositionsService)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт новую должность'})
  async create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает сортированый список должностей'})
  async findAll(@Query() query: GetPositionDto): Promise<{ data: PositionEntity[]; total: number;
      page: number; limit: number }> {
    return this.positionsService.findAll(
        {page: query.page, limit: query.limit},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает должность по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные должности по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает должность как удаленную по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updatePositionDto = new UpdatePositionDto();
    updatePositionDto.deleted_at = new Date();
    return this.positionsService.update(+id, updatePositionDto);
  }
}
