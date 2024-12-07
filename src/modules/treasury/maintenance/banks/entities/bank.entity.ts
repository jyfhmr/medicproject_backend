import { ProviderAccount } from 'src/modules/masters/providers/entities/provider_accounts.entity';
import { Treasury_maintenance_Account } from 'src/modules/treasury/maintenance/account/entities/account.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';

@Entity()
export class Treasury_maintenance_Bank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    branch: string;

    @Column()
    name: string;

    @Column()
    adress: string;

    @Column()
    bankCode: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    aba: string;

    @Column()
    routeNumber: string;

    @Column()
    swift: string;

    @Column()
    urbanization: string;

    @Column()
    street: string;

    @Column()
    building: string;

    @Column()
    municipality: string;

    @Column()
    city: string;

    @Column()
    codeZip: string;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    // Relación One-to-Many: Un banco puede tener muchas cuentas
    @OneToMany(() => Treasury_maintenance_Account, (account) => account.bank)
    accounts: Treasury_maintenance_Account[];

    // @Column()
    // street3: string;

    @OneToMany(() => ProviderAccount, (providerAccount) => providerAccount.bank)
    providerAccounts: ProviderAccount[];

    @ManyToOne(() => User, (user) => user.banksUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.banks)
    user: User;
}
