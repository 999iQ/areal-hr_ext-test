import {IsInt, IsNotEmpty} from "class-validator";
import {NOT_EMPTY_MESSAGE, NOT_INT_MESSAGE} from "../../common/constants";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class CreateFileDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'PDF файл' })
    file: Express.Multer.File;

    @Type(() => Number)
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsInt({message: NOT_INT_MESSAGE})
    employee_id: number;
}
