import {ConfigService} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export async function getTypeOrmConfig(configService: ConfigService): Promise<TypeOrmModuleOptions> {
    return {type: 'postgres',
        host: configService.getOrThrow('PG_HOST'),
        port: configService.getOrThrow('PG_PORT'),
        username: configService.getOrThrow('PG_USER'),
        password: configService.getOrThrow('PG_PASS'),
        database: configService.getOrThrow('PG_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
    };
}