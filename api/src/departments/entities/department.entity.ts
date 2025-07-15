import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {EmployeeEntity} from "../../employees/entities/employee.entity";
import {OrganizationEntity} from "../../organizations/entities/organization.entity";

@Entity({name: 'departments'})
export class DepartmentEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255})
    name: string;
    @Column({type: 'varchar', nullable: true, length: 255})
    comment: string;

    @ManyToOne(type => OrganizationEntity)
    @JoinColumn({ name: "organization_id" })
    organization_id: OrganizationEntity; // FK

    @OneToOne(type => DepartmentEntity)
    @JoinColumn({ name: "parent_id" })
    parent_id?: DepartmentEntity; // FK

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
