import {Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'positions'})
export class PositionEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', nullable: false, length: 255, unique: true})
    name: string;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
