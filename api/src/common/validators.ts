import {
    registerDecorator,
    ValidationArguments, ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {Injectable, Scope} from "@nestjs/common";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {DataSource, EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";

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

@ValidatorConstraint({ name: 'isSafelyTitle', async: false })
export class IsTitleConstraint implements ValidatorConstraintInterface {
    validate(text: string) {
        // Регулярка, которая проверяет наличие только латинских и русских символов
        const regex = /^[a-zA-Zа-яА-Я0-9.,\s]*$/;
        return regex.test(text);
    }

    defaultMessage(): string {
        return 'Текст должен содержать только цифры, латинские и русские буквы.'
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


// Мой кастомный валидатор для проверки существования переданного поля по url у сущности для sort запроса
@ValidatorConstraint({ name: 'IsEntityField', async: true })
@Injectable()
export class IsEntityFieldValidator implements ValidatorConstraintInterface {
    private readonly dataSource: DataSource;

    constructor() {
        // Получаем DataSource через глобальный доступ (fallback)
        this.dataSource = globalThis.dataSource;
    }

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        if (!this.dataSource) {
            console.error('DataSource not initialized in validator');
            return false;
        }

        const [entityClass] = args.constraints;
        if (!entityClass) {
            console.error('Entity class not provided');
            return false;
        }

        try {
            const metadata = this.dataSource.entityMetadatas.find(
                meta => meta.target === entityClass
            );

            if (!metadata) {
                console.error(`Metadata not found for ${entityClass.name}`);
                return false;
            }

            return metadata.columns.some(col => col.propertyName === value);
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        const [entityClass] = args.constraints;
        try {
            const metadata = this.dataSource.entityMetadatas.find(
                meta => meta.target === entityClass
            );
            const fields = metadata?.columns.map(col => col.propertyName) || [];
            return `Invalid field for ${entityClass.name}. Valid fields: ${fields.join(', ')}`;
        } catch {
            return `Validation failed for ${entityClass.name}`;
        }
    }
}

// декоратор для валидатора выше
export function IsEntityField(
    entity: Function,
    validationOptions?: ValidationOptions
) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: IsEntityFieldValidator,
        });
    };
}
