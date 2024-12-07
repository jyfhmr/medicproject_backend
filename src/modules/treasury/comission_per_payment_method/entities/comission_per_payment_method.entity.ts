import { User } from "src/modules/config/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Treasury_maintenance_Account } from "../../maintenance/account/entities/account.entity";
import { Treasury_maintenance_PaymentMethod } from "../../maintenance/payment_method/entities/payment_method.entity";

@Entity()
export class ComissionPerPaymentMethod {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({nullable: false})
    type: string
   
    @Column('decimal', { precision: 16, scale: 4 ,nullable: false })
    amount: number    

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User)
    userUpdate?: User;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Treasury_maintenance_Account, (account) => account.commissions, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Treasury_maintenance_Account;


    @ManyToOne(() => Treasury_maintenance_PaymentMethod)
    paymentMethod: Treasury_maintenance_PaymentMethod
}
