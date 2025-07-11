import {
    IsNotEmpty, IsString, Length, Validate,
    ValidatorConstraint, ValidatorConstraintInterface, IsEmail, IsIn, IsOptional
} from "class-validator";


@ValidatorConstraint({ name: 'isSafelyText', async: false })
export class CustomTextValidator implements ValidatorConstraintInterface {
    validate(text: string) {
        // Регулярка, которая проверяет наличие только чисел, латинских и русских символов
        const regex = /^[a-zA-Zа-яА-Я\s]*$/;
        return regex.test(text);
    }

    defaultMessage(): string {
        return 'Текст должен содержать только латинские и русские буквы.'
    }
}

@ValidatorConstraint({ name: 'isLogin', async: false })
export class IsLoginConstraint implements ValidatorConstraintInterface {
    validate(text: string) {
        // Разрешены буквы, цифры, точки, подчеркивания и дефисы
        const regex = /^[a-zA-Z0-9._-]+$/;
        return regex.test(text);
    }

    defaultMessage() {
        return 'Логин может содержать только буквы латинского алфавита, цифры, точки, подчеркивания и дефисы.';
    }
}

@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*()_+=-[]{}|;:,.?]).+$/;
        return regex.test(password);
    }

    defaultMessage() {
        return 'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.';
    }
}

export const NOT_EMPTY_MESSAGE = 'Поле не должно быть пустым';
export const STRING_MESSAGE = 'Поле должно быть строкой';
export const NOT_ENUM_MESSAGE = 'Роль должна быть выбрана из списка';
export const LENGTH_MESSAGE_2 = 'Длина текста от 2 до 255 символов';

export class CreateUserDto {
    @IsNotEmpty({message: NOT_EMPTY_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(CustomTextValidator)
    lastName: string;

    @IsNotEmpty({message: STRING_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(CustomTextValidator)
    firstName: string;

    @IsString({message: STRING_MESSAGE})
    @Length(2,255, {message: LENGTH_MESSAGE_2})
    @Validate(CustomTextValidator)
    @IsOptional() // maybe is null
    middleName?: string;

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

    @IsNotEmpty({message: STRING_MESSAGE})
    @IsString({message: STRING_MESSAGE})
    @IsIn(['admin', 'manager'], {message: NOT_ENUM_MESSAGE})
    role: string;
}

