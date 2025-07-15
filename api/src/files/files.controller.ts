import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateFileDto = new UpdateFileDto()
    updateFileDto.deleted_at = new Date();
    return this.filesService.update(+id, updateFileDto);
  }
}
