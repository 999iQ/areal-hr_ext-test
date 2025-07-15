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
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {GetUserDto} from "../user/dto/get-user.dto";
import {UserEntity} from "../user/entities/user.entity";
import {GetOrganizationsDto} from "./dto/get-organizatios.dto";
import {OrganizationEntity} from "./entities/organization.entity";

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async findAll(@Query() query: GetOrganizationsDto): Promise<{ data: OrganizationEntity[]; total: number; page: number; limit: number }> {
    return this.organizationsService.findAll(
        {page: query.page, limit: query.limit},
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateOrgDto = new UpdateOrganizationDto()
    updateOrgDto.deleted_at = new Date();
    return this.organizationsService.update(+id, updateOrgDto);
  }
}
