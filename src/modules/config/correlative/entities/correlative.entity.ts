import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('config_correlative')
export class Correlative {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module: string;

    @Column()
    subModule: string;

    @Column()
    correlative: number;

    @Column()
    currentYear: string;

    @Column()
    currentMonth: string;

    @Column()
    currentCode: string;
}
