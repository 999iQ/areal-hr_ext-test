import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity({name: 'audit_history'})
export class AuditHistoryEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'timestamp', nullable: false, default: () => 'NOW()'})
    changed_at: Date;
    @Column({type: 'varchar', nullable: false, length: 255})
    object_type: string;
    @Column({type: 'int', nullable: false})
    object_id: number;
    @Column({type: 'varchar', nullable: false})
    old_value: string;
    @Column({type: 'varchar', nullable: false})
    new_value: string;
    @Column({type: 'varchar', nullable: false})
    source_info: string;

    @ManyToOne(type => UserEntity)
    @JoinColumn({ name: "user_id" })
    user_id: UserEntity; // FK

}
