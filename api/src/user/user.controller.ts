import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UsePipes, ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserEntity} from "./entities/user.entity";
import {GetUserDto} from "./dto/get-user.dto";
import {ApiExtraModels, ApiOperation} from "@nestjs/swagger";

@Controller('users')
@ApiExtraModels(CreateUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({summary: 'Создаёт нового пользователя'})
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary: 'Возвращает сортированный список пользователей'})
  async findAll(@Query() query: GetUserDto): Promise<{ data: UserEntity[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'id', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  @ApiOperation({summary: 'Возвращает пользователя по id'})
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Изменяет данные пользователя по id'})
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Помечает пользователя как удаленного по id'})
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateUserDto = new UpdateUserDto()
    updateUserDto.deleted_at = new Date();
    return this.userService.update(+id, updateUserDto);
  }
}
