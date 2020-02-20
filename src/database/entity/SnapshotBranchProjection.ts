import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class SnapshotBranchProjection {
    @PrimaryColumn()
    OrganizationId: string;
    
    @PrimaryColumn()
    RepositoryId: string;

    @PrimaryColumn()
    SnapshotId: number;

    @PrimaryColumn()
    Branch: string;

    @Column()
    ComponentType: string
    
    @Column()
    ComponentName: string
    
    @Column()
    ComponentVersion: string
}
