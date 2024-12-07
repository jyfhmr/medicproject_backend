import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Treasury_maintenance_Tax } from '../../taxes/entities/tax.entity';
import { purchasing_creditNote } from 'src/modules/purchasing/creditNote/entities/creditNote.entity';
import { Treasury_maintenance_Account } from '../../account/entities/account.entity';
import { Treasury_maintenance_PaymentMethod } from '../../payment_method/entities/payment_method.entity';
import { DebitNote } from 'src/modules/purchasing/debit-note/entities/debit-note.entity';
import { CashierConfig } from '../../cashier_config/entities/cashier_config.entity';
import { CreditNotSale } from 'src/modules/sales/credit-not-sales/entities/credit-not-sale.entity';
import { DebitNoteSale } from 'src/modules/sales/debit-note-sales/entities/debit-note-sale.entity';

@Entity()
export class Treasury_maintenance_Money {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    money: string;

    @Column()
    symbol: string;

    @Column({ nullable: true })
    file?: string; //puede ser nulo

    @OneToMany(() => Treasury_maintenance_Tax, (tax) => tax.applicableCurrency)
    taxes: Treasury_maintenance_Tax[];

    @OneToMany(() => purchasing_creditNote, (creditNote) => creditNote.typeMoney)
    creditNote: purchasing_creditNote[];

    @OneToMany(() => CreditNotSale, (creditNoteSale) => creditNoteSale.typeMoney)
    creditNoteSale: CreditNotSale[];

    @OneToMany(() => CashierConfig, (cashierConfig) => cashierConfig.money)
    cashierConfig: CashierConfig[];

    @OneToMany(() => DebitNote, (debitNote) => debitNote.typeMoney)
    debitNote: DebitNote[];

    @OneToMany(() => DebitNoteSale, (debitNoteSale) => debitNoteSale.typeMoney)
    debitNoteSale: DebitNote[];

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.moneysUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.moneys)
    user: User;

    @OneToMany(() => Treasury_maintenance_Account, (accounts) => accounts.currencyUsed)
    accounts: Treasury_maintenance_Account[];

    @ManyToMany(
        () => Treasury_maintenance_PaymentMethod,
        (paymentMethod) => paymentMethod.currencies_available_for_this_method,
    )
    paymentMethodsWithThisCurrency: Treasury_maintenance_PaymentMethod[];
}
