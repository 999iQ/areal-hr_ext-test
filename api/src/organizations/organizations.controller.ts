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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {GetOrganizationsDto} from "./dto/get-organizatios.dto";
import {OrganizationEntity} from "./entities/organization.entity";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('organizations')
@ApiExtraModels(CreateOrganizationDto)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт новую организацию'})
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает сортированный список организаций'})
  async findAll(@Query() query: GetOrganizationsDto): Promise<{ data: OrganizationEntity[]; total: number; page: number; limit: number }> {
    return this.organizationsService.findAll(
        {page: query.page, limit: query.limit},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает организацию по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные организации по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает организацию как удаленную по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateOrgDto = new UpdateOrganizationDto()
    updateOrgDto.deleted_at = new Date();
    return this.organizationsService.update(+id, updateOrgDto);
  }
}
