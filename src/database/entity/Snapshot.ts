import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity()
export class Snapshot {
    
    @PrimaryColumn({
        length:39
    })
    org: string;

    @PrimaryColumn({
        length:100
    })
    repo: string;

    @PrimaryColumn({
        length:40
    })
    key:  string;

    @PrimaryColumn({
        length:40
    })
    value:  string;

    @Column({
        generated:true,
        unique:true,
        primary:true
    }) 
    snapshotId: number; 

    @Column('datetime')
    dateModified:  Date;

    @Column({
        length:40
    })
    blobId: string
}


