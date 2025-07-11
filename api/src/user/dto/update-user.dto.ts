import { PartialType } from '@nestjs/mapped-types';
import {
    CreateUserDto
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // UpdateUserDto - наследует CreateUserDto все поля как необязательные
}
