import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {EmployeeEntity} from "../../employees/entities/employee.entity";
import {DepartmentEntity} from "../../departments/entities/department.entity";
import {PositionEntity} from "../../positions/entities/position.entity";

@Entity({name: 'recruit_opers'})
export class RecruitOperEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'decimal', nullable: false})
    salary: number;

    @Column({type: 'timestamp', nullable: true, default: () =>'NOW()'})
    hire_date?: Date;
    @Column({type: 'timestamp', nullable: true})
    dismissal_date?: Date;

    @ManyToOne(type => EmployeeEntity)
    @JoinColumn({ name: "employee_id" })
    employee_id: EmployeeEntity; // FK

    @ManyToOne(type => DepartmentEntity)
    @JoinColumn({ name: "department_id" })
    department_id: DepartmentEntity; // FK

    @ManyToOne(type => PositionEntity)
    @JoinColumn({ name: "position_id" })
    position_id: PositionEntity; // FK
}
