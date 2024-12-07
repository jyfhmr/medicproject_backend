import { User } from 'src/modules/config/users/entities/user.entity';
import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity';
import { Treasury_Payments } from 'src/modules/treasury/payments/entities/payment.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity('treasury_maintenance_cashier_config')
export class CashierConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // Relacionar la moneda a una entidad de Currency
    @ManyToOne(() => Treasury_maintenance_Money)
    money: Treasury_maintenance_Money; // Moneda aplicable al impuesto

    @Column('decimal', { precision: 16, scale: 4 })
    balance: number;

    @Column('decimal', { precision: 16, scale: 4, default: 0 })
    blockedBalance: number;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.cashierConfigUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.cashierConfig)
    user: User;

    @OneToMany(() => Treasury_Payments, (payment) => payment.registerCashier, { cascade: true })
    paymentsFromThisCashier: Treasury_Payments[];
}
