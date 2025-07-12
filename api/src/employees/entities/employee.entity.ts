import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'employees'})
export class EmployeeEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255})
    last_name: string;
    @Column({type: 'varchar', nullable: false, length: 255})
    first_name: string;
    @Column({type: 'varchar', nullable: false, length: 255})
    middle_name: string;
    @Column({type: 'date', nullable: true})
    birth_date?: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
