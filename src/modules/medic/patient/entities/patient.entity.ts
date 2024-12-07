import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum Gender {
    M = 'M',
    F = 'F',
    O = 'O',
}

export enum MaritalStatus {
    Soltero = 'Soltero',
    Casado = 'Casado',
    Divorciado = 'Divorciado',
    Viudo = 'Viudo',
}

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    // Nombre completo del paciente
    @Column()
    name: string;

    // DNI del paciente
    @Column()
    dni: string;

    // Teléfono del paciente
    @Column()
    phone: string;

    // Dirección del paciente
    @Column()
    address: string;

    // Correo del paciente
    @Column()
    email: string;

    // Fecha de nacimiento
    @Column()
    birthdate: Date;

    // Género del paciente - M: Masculino, F: Femenino, O: Otro
    @Column({
        type: 'enum',
        enum: Gender,
    })
    gender: Gender;

    // Estado civil - Soltero, Casado, Divorciado, Viudo
    @Column({
        type: 'enum',
        enum: MaritalStatus,
    })
    marital_status: MaritalStatus;

    // Condiciones médicas y enfermedades preexistentes
    @Column({ type: 'text', nullable: true })
    preexisting_conditions: string;

    // Antecedentes familiares
    @Column({ type: 'text', nullable: true })
    family_history: string;

    // Nombre del contacto de emergencia
    @Column({ nullable: true })
    emergency_contact_name: string;

    // Telefono del contacto de emergencia
    @Column({ nullable: true })
    emergency_contact_phone: string;

    // Consumo de tabaco
    @Column()
    smoker: boolean;

    // Consumo de alcohol
    @Column()
    alcohol_drinker: boolean;

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
}
