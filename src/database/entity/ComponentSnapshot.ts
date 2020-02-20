import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ComponentSnapshot {
    @PrimaryColumn({
        length: 39,
    })
    org: string;

    @PrimaryColumn({
        length: 100,
    })
    repo: string;

    @PrimaryColumn('varchar')
    coordinate: string;

    @PrimaryColumn()
    snapshotId: number;
}

