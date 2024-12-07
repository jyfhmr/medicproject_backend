import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Provider } from './provider.entity';
import { Treasury_maintenance_Bank } from 'src/modules/treasury/maintenance/banks/entities/bank.entity';

@Entity('provider_accounts')
export class ProviderAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    email: string;

    @Column({ type: 'int' })
    phone: number;

    @ManyToOne(() => Provider, (provider) => provider.providerAccounts)
    provider: Provider;

    @ManyToOne(() => Treasury_maintenance_Bank, (bank) => bank.providerAccounts)
    bank: Treasury_maintenance_Bank;
}
