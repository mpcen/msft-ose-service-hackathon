import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class SnapshotMetadata {
    @PrimaryColumn({
        length: 39,
    })
    org: string;

    @PrimaryColumn({
        length: 100,
    })
    repo: string;

    @PrimaryColumn()
    snapshotId: number;

    @PrimaryColumn('varchar')
    metadata: string;
}