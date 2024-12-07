import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Treasury_maintenance_Tax } from './tax.entity';

@Entity('treasury_maintenance_type_tax')
export class Treasury_maintenance_type_tax {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    typeTax: string;

    @OneToMany(() => Treasury_maintenance_Tax, (tax) => tax.typeTax)
    taxes: Treasury_maintenance_Tax[];

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;
}
