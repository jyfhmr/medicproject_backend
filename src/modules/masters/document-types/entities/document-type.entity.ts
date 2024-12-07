import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { IdentificationType } from '../../identification-types/entities/identification-type.entity';
import { Client } from '../../clients/entities/client.entity';
import { Company } from 'src/modules/config/companies/entities/company.entity';
import { Provider } from '../../providers/entities/provider.entity';

@Entity('document_types')
export class DocumentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date; // Creation date

    @UpdateDateColumn()
    updatedAt: Date; // Last updated date

    @ManyToOne(() => User, (user) => user.documentTypes)
    user: User;

    @ManyToOne(() => User, (user) => user.documentTypesUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => IdentificationType, (identificationType) => identificationType.documentTypes)
    identificationType: IdentificationType;

    @OneToMany(() => Client, (client) => client.documentType)
    clients: Client[];

    @OneToMany(() => Company, (company) => company.documentTypeLegalRepresentative)
    companies: Company[];

    @OneToMany(() => Provider, (provider) => provider.documentType)
    providers: Provider[];
}
