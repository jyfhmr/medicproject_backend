import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('taxpayer_types_porcentage')
export class TaxpayerTypePorcentage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    porcentage: number;

    @Column({ unique: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;
}
