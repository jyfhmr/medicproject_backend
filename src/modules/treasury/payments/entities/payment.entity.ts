import { IsNumber } from "class-validator";
import { Config_TypeOfPerson } from "src/modules/config/type_of_people/entities/type_of_person.entity";
import { User } from "src/modules/config/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Treasury_maintenance_Money } from "../../maintenance/money/entities/money.entity";
import { Provider } from "src/modules/masters/providers/entities/provider.entity";
import { Treasury_maintenance_PaymentMethod } from "../../maintenance/payment_method/entities/payment_method.entity";
import { Treasury_maintenance_Bank } from "../../maintenance/banks/entities/bank.entity";
import { DocumentType } from "src/modules/masters/document-types/entities/document-type.entity";
import { IdentificationType } from "src/modules/masters/identification-types/entities/identification-type.entity";
import { Treasury_maintenance_Account } from "../../maintenance/account/entities/account.entity";
import { Status } from "src/modules/config/status/entities/status.entity";
import { CashierConfig } from "../../maintenance/cashier_config/entities/cashier_config.entity";
import { Treasury_Movements } from "../../movements/entities/movement.entity";



@Entity()
export class Treasury_Payments {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Config_TypeOfPerson,
        (typeOfPerson) => typeOfPerson.payments,
    )
    typeOfPerson: Config_TypeOfPerson

    //identificacion unica de la contraparte
    @ManyToOne(() => DocumentType)
    type_of_document: DocumentType

    @ManyToOne(() => IdentificationType)
    type_of_identification: IdentificationType

    @Column()
    document_of_counterparty: string;

    @Column()
    name_of_counterparty: string;

    @ManyToOne(() => Provider, { nullable: true })
    provider_who_gets_the_payment: Provider
    // . . .  . . .. . . .  . .. .. . .. . . .. 

    //información general del pago
    @ManyToOne(() => Treasury_maintenance_Money) //usualmente será el bolívar
    currencyUsed: Treasury_maintenance_Money;

    @ManyToOne(() => Treasury_maintenance_PaymentMethod)
    payment_method: Treasury_maintenance_PaymentMethod

    @Column('decimal', { precision: 16, scale: 4 })
    amountPaid: number;

    @Column({ nullable: true })
    voucher_image_url: string

    @Column()
    paymentDate: Date;

    //Campos genéricos

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


    @Column()
    correlativeCode: string

    //campos de cada pago

    //transferencia bancaria, deposito
    @ManyToOne(() => Treasury_maintenance_Account, { nullable: true })
    transfer_account_number: Treasury_maintenance_Account

    @Column({ nullable: true })
    transfer_account_number_of_receiver: string


    

    
    //pago movil
    @Column({ nullable: true })
    pagomovilDocument: string

    @Column({ nullable: true })
    pagomovilPhoneNumber: string



    //transferencia, deposito,pagomovil
    @ManyToOne(() => Treasury_maintenance_Bank, { nullable: true })
    bankEmissor: Treasury_maintenance_Bank;

    @ManyToOne(() => Treasury_maintenance_Bank, { nullable: true })
    bankReceptor: Treasury_maintenance_Bank;



    //cash
    @ManyToOne(() => CashierConfig, { nullable: true })
    registerCashier: CashierConfig





    //zelle,paypal
    @Column({ nullable: true })
    emailReceptor: string

    @Column({ nullable: true })
    emailEmisor: string



    //zelle
    @Column({ nullable: true })
    addressee_name: string


    //deposito bancario
    @Column({ nullable: true })
    deposit_account_number: string


    //zelle,paypal,transferencia,deposito,tarjeta de debito, tarjeta de credito, pagomovil
    @Column({ nullable: true })
    paymentReference: string



    @Column('decimal', { precision: 16, scale: 4 })
    balance: number;



    @ManyToOne(() => Status)
    paymentStatus: Status;


    //movimientos . . . cuando los haya 

    @OneToOne(() => Treasury_Movements, (movement) => movement.payment, { cascade: true })
    @JoinColumn()
    movementGenerated: Treasury_Movements;

}
