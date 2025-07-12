import {
    IsNotEmpty, IsString, Length, Validate,
     IsEmail, IsIn, IsOptional
} from "class-validator";
import {IsLoginConstraint, IsTextConstraint} from "../../common/validators";
import {LENGTH_MESSAGE_2, NOT_EMPTY_MESSAGE, NOT_ENUM_MESSAGE, STRING_MESSAGE} from "../../common/constants";


export class CreateUserDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsTextConstraint)
    last_name: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsTextConstraint)
    first_name: string;

    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsTextConstraint)
    @IsOptional() // maybe is null
    middle_name?: string;

    @IsString({message: STRING_MESSAGE})
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @IsEmail()
    email: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(IsLoginConstraint)
    login: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Validate(IsLoginConstraint)
    @Length(6,32, {message: 'Длина пароля от 6 до 32 символов'})
    password: string;

    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @IsIn(['admin', 'manager'], {message: NOT_ENUM_MESSAGE})
    role: string;
}

