import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {EmployeeEntity} from "../../employees/entities/employee.entity";

@Entity({name: 'passport_info'})
export class PassportInfoEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'json', nullable: false})
    passport_data: string;

    @ManyToOne(type => EmployeeEntity)
    @JoinColumn({ name: "employee_id" })
    employee_id: EmployeeEntity; // FK

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
