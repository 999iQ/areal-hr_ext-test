import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile, UsePipes, ValidationPipe, Query, Res
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {ApiConsumes, ApiExtraModels, ApiOperation} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {GetFileDto} from "./dto/get-file.dto";
import {FilesEntity} from "./entities/file.entity";
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('files')
@ApiExtraModels(CreateFileDto)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({summary: 'Загрузка файла'})
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    return this.filesService.create(file, createFileDto.employee_id);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает список логов'})
  async findAll(@Query() query: GetFileDto): Promise<{ data: FilesEntity[];
    total: number; page: number; limit: number }> {
    return this.filesService.findAll({page: query.page, limit: query.limit,
          sortField: query.sort || 'id', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает файл по id'})
  async findOne(@Param('id', ParseIntPipe) id: string, @Res() res: Response) {
    const fileInfo = await this.filesService.findOne(+id);
    const fileStream = createReadStream(fileInfo.download_path);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
      'Content-Length': fileInfo.file_size
    });

    fileStream.pipe(res);
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
