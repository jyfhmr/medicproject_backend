import { User } from 'src/modules/config/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Adjunte } from '../../adjuntes/entities/adjunte.entity';
import { AdjunteV2 } from '../../adjuntesv2/entities/adjuntesv2.entity';

@Entity()
export class ClinicHistory {
    @PrimaryGeneratedColumn()
    id: number;

    //relación manytoone con un paciente
    @ManyToOne(() => Patient)
    patient: Patient;

    //Fecha de consulta
    @Column()
    appointment_date: Date;

    //Notas del médico
    @Column({ length: 2000 })
    note: string;

    //diagnóstico si lo hay
    @Column({ nullable: true,length: 2000 })
    diagnosis: string;

    //Tratamiento
    @Column({ length: 2000 })
    treatment: string;

    //Motivo
    @Column({ length: 2000 })
    motive: string;

 
    //Número de consulta
    @Column()
    consultNumber: number;


    //Campos implícitos

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => User, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User)
    user: User;


    @OneToMany(()=> Adjunte , (adjunte)=>{adjunte.clinicHistoryRelated})
    adjuntes: Adjunte

    @OneToMany(() => AdjunteV2, (adjunteV2) => adjunteV2.clinicHistoryRelated)
    adjuntesV2: AdjunteV2[];
}
