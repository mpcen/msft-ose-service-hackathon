import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Snapshot } from './Snapshot';

@Entity()
export class Metadata {
    @PrimaryColumn({
        length: 39,
    })
    org: string;

    @PrimaryColumn({
        length: 100,
    })
    repo: string;

    @PrimaryColumn()
    @ManyToOne(() => Snapshot, snapshot => snapshot.snapshotId)
    @JoinColumn(
    [
        { name: 'org', referencedColumnName: 'org' },
        { name: 'repo', referencedColumnName: 'repo' },
        { name: 'snapshotId', referencedColumnName: 'snapshotId' }
    ])
    snapshotId: number;

    @PrimaryColumn({
        length: 40,
    }) 
    key: string;

    @PrimaryColumn({
        length: 40,
    })
    value: string;

    @Column({
        generated: true,
        unique: true,
        primary: true,
    })
    metaDataId: number;
}
