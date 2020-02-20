import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ProcessedSnapshots {
    @Column()
    SnapshotId: number

    @PrimaryColumn()
    JobName: string
}
