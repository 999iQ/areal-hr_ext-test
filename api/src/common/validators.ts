import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: 'isSafelyText', async: false })
export class IsTextConstraint implements ValidatorConstraintInterface {
    validate(text: string) {
        // Регулярка, которая проверяет наличие только латинских и русских символов
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