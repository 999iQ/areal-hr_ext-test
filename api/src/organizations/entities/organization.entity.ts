import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'organizations'})
export class OrganizationEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    name: string;
    @Column({type: 'varchar', nullable: true, length: 1024})
    comment?: string;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
