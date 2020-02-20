import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Metadata } from './Metadata';
@Entity()
export class Snapshot {
    @PrimaryColumn({
        length: 39,
    })
    org: string;

    @PrimaryColumn({
        unique: true,
        length: 100,
    })
    repo: string;

    @Column({
        primary: true,
        unique: true,
        generated: true
    })
    snapshotId: number;

    @Column({
        default: () => "CURRENT_TIMESTAMP"
    })
    dateModified: Date;

    @Column({
        length: 40,
    })
    blobId: string;

    @OneToMany(() => Metadata, metadata => metadata.snapshotId, { cascade: ["insert","remove"] } )
    metadata: Metadata[]
    
}