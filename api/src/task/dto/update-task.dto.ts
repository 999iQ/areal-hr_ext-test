import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import {IsBoolean, IsNotEmpty, IsString, Length} from "class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название не должно быть пустым" })
    @Length(3,10, { message: "Длина от 3 до 10" })
    title: string;

    @IsBoolean({ message: "Статус должен быть булевым" })
    isCompleted: boolean;
}
