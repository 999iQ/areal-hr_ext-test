import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { PassportInfoService } from './passport_info.service';
import { CreatePassportInfoDto } from './dto/create-passport_info.dto';
import { UpdatePassportInfoDto } from './dto/update-passport_info.dto';
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('passport-info')
@ApiExtraModels(PassportInfoService)
export class PassportInfoController {
  constructor(private readonly passportInfoService: PassportInfoService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт новый объект с паспортными данными'})
  async create(@Body() createPassportInfoDto: CreatePassportInfoDto) {
    return this.passportInfoService.create(createPassportInfoDto);
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает паспортные данные по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.passportInfoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет паспортные данные по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updatePassportInfoDto: UpdatePassportInfoDto) {
    return this.passportInfoService.update(+id, updatePassportInfoDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает объект паспортных данных как удаленный по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updatePassportInfoDto = new UpdatePassportInfoDto
    updatePassportInfoDto.deleted_at = new Date();
    return this.passportInfoService.update(+id, updatePassportInfoDto);
  }
}
