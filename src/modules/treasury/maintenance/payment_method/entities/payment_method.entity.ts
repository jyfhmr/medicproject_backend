import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Treasury_maintenance_Account } from '../../account/entities/account.entity';
import { Treasury_maintenance_Money } from '../../money/entities/money.entity';

@Entity()
export class Treasury_maintenance_PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    method: string;
    @Column()
    typeMethodPayment: string;
    @Column()
    description?: string;
    @Column()
    code: number;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.PaymentMethodUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.paymentMethod)
    user: User;

    @ManyToMany(() => Treasury_maintenance_Account, account => account.paymentMethods)
    accountsWithThisPaymentMethod: Treasury_maintenance_Account[];

    @ManyToMany(() => Treasury_maintenance_Money, currency => currency.paymentMethodsWithThisCurrency)
    @JoinTable({
        name: 'currencys_related_to_payment_methods', // Nombre personalizado de la tabla intermedia
        joinColumn: {
          name: 'payment_method_id', // Referencia a PaymentMethod
          referencedColumnName: 'id', 
        },
        inverseJoinColumn: {
          name: 'currency_id',  // Referencia a Money
          referencedColumnName: 'id',
        },
      })
    currencies_available_for_this_method: Treasury_maintenance_Money[];

}
