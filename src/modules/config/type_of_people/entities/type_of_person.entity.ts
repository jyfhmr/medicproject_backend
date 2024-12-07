import { Treasury_Payments } from "src/modules/treasury/payments/entities/payment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";



@Entity()
export class Config_TypeOfPerson {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        () =>  Treasury_Payments, (payments) => payments.id
    )
    payments: Treasury_Payments[];

   
    //Campos genéricos

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => User, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, )
    user: User;

}
