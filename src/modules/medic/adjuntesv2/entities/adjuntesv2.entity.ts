import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ClinicHistory } from '../../clinic-history/entities/clinic-history.entity';


@Entity()
export class AdjunteV2 {
    @PrimaryGeneratedColumn()
    id: number;

    //url de imagen
    @Column()
    url: string;

    //titulo de la imagen
    @Column({ nullable: true })
    note: string;

    //Campos implícitos
    @CreateDateColumn()
    createdAt: Date;
    // Relación ManyToOne con ClinicHistory (Una historia clínica tiene muchos adjuntos)
    @ManyToOne(() => ClinicHistory, (clinicHistory) => clinicHistory.adjuntesV2)
    clinicHistoryRelated: ClinicHistory;
}

