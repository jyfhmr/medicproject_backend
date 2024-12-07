import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DocumentType } from 'src/modules/masters/document-types/entities/document-type.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    rif: string;

    @Column({ nullable: true })
    logo?: string;

    @Column({ nullable: true })
    seal?: string;

    @Column({ nullable: true })
    signature?: string;

    @Column()
    businessName: string;

    @Column({ nullable: true })
    web?: string;

    @Column({ type: 'date' })
    rifDueDate: Date;

    @Column({ nullable: true })
    rifFile?: string;

    @Column()
    fiscalAddress: string;

    @Column()
    nameLegalRepresentative: string;

    @Column()
    lastNameLegalRepresentative: string;

    @Column({ type: 'int' })
    identificationLegalRepresentative: number;

    @Column({ type: 'date' })
    dueDateLegalRepresentative: Date;

    @Column({ nullable: true })
    rifLegalRepresentativeFile?: string;

    @Column()
    nameRegister: string;

    @Column({ nullable: true })
    volumeRegister: string;

    @Column({ type: 'date' })
    dateRegister: Date;

    @Column({ type: 'int' })
    profitMargin: number;

    @Column({ nullable: true })
    numberRegister: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.actions)
    user: User;

    @ManyToOne(() => User, (user) => user.actionsUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => DocumentType, (documentType) => documentType.companies)
    documentTypeLegalRepresentative: DocumentType;

    // multiempresa
    @Column()
    isHeadquarters: boolean;

    @ManyToOne(() => Company, (company) => company.branches)
    @JoinColumn({ name: 'headquarterOf' })
    headquarterOf: Company;

    @OneToMany(() => Company, (company) => company.headquarterOf)
    branches: Company[];
}
