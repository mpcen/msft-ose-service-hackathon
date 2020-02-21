import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SnapshotBranchProjection {
    @PrimaryGeneratedColumn()
    projectionId: number;

    @Column()
    OrganizationId: string;
    
    @Column()
    RepositoryId: string;

    @Column()
    SnapshotId: number;

    @Column()
    Branch: string;

    @Column()
    ComponentType: string
    
    @Column()
    ComponentName: string
    
    @Column()
    ComponentVersion: string
}
