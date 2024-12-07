import { User } from "src/modules/config/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClinicHistory } from "../../clinic-history/entities/clinic-history.entity";

@Entity()
export class Adjunte {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({unique: true})
    // uid: string
    
    @ManyToOne(() => ClinicHistory, (clinicHistory) => clinicHistory.adjuntes)
    @JoinColumn()
    clinicHistoryRelated: ClinicHistory;

    //url de imagen
    @Column()
    url: string;

    //titulo de la imagen
    @Column({ nullable: true })
    note: string;

    //Campos implícitos
    @CreateDateColumn()
    createdAt: Date;

}

