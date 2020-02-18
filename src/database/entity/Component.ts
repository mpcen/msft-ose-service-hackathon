import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Component {
    @PrimaryColumn('varchar')
    name: string;

    @PrimaryColumn('varchar')
    version: string;

    @Column('tinyint')
    type: number;
}
