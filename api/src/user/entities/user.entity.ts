import {Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AuditHistoryEntity} from "../../audit_history/entities/audit_history.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255})
    last_name: string;
    @Column({type: 'varchar', nullable: false, length: 255})
    first_name: string;
    @Column({type: 'varchar', nullable: true, length: 255})
    middle_name?: string;
    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    email: string;
    @Column({type: 'varchar', nullable: false, length: 16, unique: true})
    login: string;
    @Column({type: 'varchar', nullable: false, length: 32})
    password: string;
    @Column({type: 'varchar', nullable: false, enum: ['admin', 'manager']})
    role: string;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;

    @OneToMany(type => AuditHistoryEntity, audit => audit.user_id)
    AuditHistories: AuditHistoryEntity[];
}
