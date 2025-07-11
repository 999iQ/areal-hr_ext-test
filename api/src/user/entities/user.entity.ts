import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, name: 'last_name'})
    lastName: string;
    @Column({type: 'varchar', nullable: false, length: 255, name: 'first_name'})
    firstName: string;
    @Column({type: 'varchar', nullable: true, length: 255, name: 'middle_name'})
    middleName?: string;
    @Column({type: 'varchar', nullable: false, length: 255, name: 'email', unique: true})
    email: string;
    @Column({type: 'varchar', nullable: false, length: 16, name: 'login', unique: true})
    login: string;
    @Column({type: 'varchar', nullable: false, length: 32, name: 'password'})
    password: string;
    @Column({type: 'varchar', nullable: false, enum: ['admin', 'manager'], name: 'role'})
    role: string;

    @DeleteDateColumn({type: 'timestamp', nullable: true, name: 'deleted_at'})
    deleted_at: Date;
}
