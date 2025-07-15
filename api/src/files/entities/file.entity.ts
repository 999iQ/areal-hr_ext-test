import {Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {EmployeeEntity} from "../../employees/entities/employee.entity";

@Entity({name: 'files'})
export class FilesEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255})
    filename: string;
    @Column({type: 'varchar', nullable: false, length: 1024})
    download_path: string;
    @Column({type: 'int', nullable: false})
    file_size: number;

    @OneToOne(type => EmployeeEntity)
    @JoinColumn({ name: "employee_id" })
    employee_id: EmployeeEntity; // FK

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
