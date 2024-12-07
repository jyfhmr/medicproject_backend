import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { ProviderAccount } from './provider_accounts.entity';
import { User } from 'src/modules/config/users/entities/user.entity';
import { TaxpayerType } from '../../taxpayer-types/entities/taxpayer-type.entity';
import { City } from '../../cities/entities/city.entity';
import { DocumentType } from '../../document-types/entities/document-type.entity';
import { TaxpayerTypePorcentage } from '../../taxpayer-types/entities/taxpayer_type_porcentage.entity';
import { config_admistrative_paymentConcept } from 'src/modules/audits/payment_concepts/entities/payment_concept.entity';
import { TypesPeopleIsrl } from 'src/modules/audits/types_people_isrl/entities/types_people_isrl.entity';
import { purchasing_creditNote } from 'src/modules/purchasing/creditNote/entities/creditNote.entity';
import { DebitNote } from 'src/modules/purchasing/debit-note/entities/debit-note.entity';
import { CreditNotSale } from 'src/modules/sales/credit-not-sales/entities/credit-not-sale.entity';
import { DebitNoteSale } from 'src/modules/sales/debit-note-sales/entities/debit-note-sale.entity';

@Entity('mt_providers')
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    businessName: string;

    @Column()
    tradeName: string;

    @Column({ type: 'int' })
    phone: number;

    @Column()
    email: string;

    @Column({ type: 'text' })
    address: string;

    @Column()
    website: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.providers)
    user: User;

    @ManyToOne(() => User, (user) => user.providersUpdated, { nullable: true })
    userUpdate?: User;

    @OneToMany(() => ProviderAccount, (providerAccount) => providerAccount.provider)
    providerAccounts: ProviderAccount[];

    @ManyToOne(() => TaxpayerType, (taxpayer) => taxpayer.providers)
    taxpayer: TaxpayerType;

    @ManyToOne(() => TaxpayerTypePorcentage, (taxpayerporcentage) => taxpayerporcentage.id)
    taxRetentionPercentage: TaxpayerTypePorcentage;

    @ManyToMany(
        () => config_admistrative_paymentConcept,
        (paymentConcept) => paymentConcept.providers,
    )
    @JoinTable({
        name: 'mt_provider_payment_concept', // Nombre de la tabla pivote
        joinColumn: {
            name: 'provider_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'payment_concept_id',
            referencedColumnName: 'id',
        },
    })
    paymentConcepts: config_admistrative_paymentConcept[];

    @ManyToOne(() => City, (city) => city.providers)
    city: City;

    @ManyToOne(() => TypesPeopleIsrl, (typesPeopopleIsrl) => typesPeopopleIsrl.id)
    typePeopleIsrl: TypesPeopleIsrl;

    @OneToMany(() => purchasing_creditNote, (creditNote) => creditNote.company)
    creditNote: purchasing_creditNote[];

    @OneToMany(() => CreditNotSale, (creditNoteSale) => creditNoteSale.company)
    creditNoteSale: CreditNotSale[];

    @OneToMany(() => DebitNote, (debitNote) => debitNote.company)
    debitNote: DebitNote[];

    @OneToMany(() => DebitNoteSale, (debitNoteSale) => debitNoteSale.company)
    debitNoteSale: DebitNoteSale[];

    @Column()
    identification: string;

    @ManyToOne(() => DocumentType, (documentType) => documentType.providers)
    documentType: DocumentType;

    @Column()
    legalRepresentativeName: string;

    @Column()
    legalRepresentativeLastName: string;

    @Column({ type: 'date' })
    constitutionDate: Date;
}
