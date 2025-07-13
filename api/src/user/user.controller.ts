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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async findAll(@Query() query: GetUserDto): Promise<{ data: UserEntity[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(
        {page: query.page, limit: query.limit, sortField: query.sort || 'id', order: query.order || 'asc'},
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const updateUserDto = new UpdateUserDto()
    updateUserDto.deleted_at = new Date();
    return this.userService.update(+id, updateUserDto);
  }
}
