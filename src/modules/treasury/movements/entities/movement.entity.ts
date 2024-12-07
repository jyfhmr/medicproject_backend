import { User } from "src/modules/config/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Treasury_Payments } from "../../payments/entities/payment.entity";
import { Treasury_TypeOfMovement } from "../../maintenance/type_of_movement/entities/type_of_movement.entity";
import { IsNumber } from "class-validator";


@Entity()
export class Treasury_Movements {

    @PrimaryGeneratedColumn()
    id: number;
 
    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.updatedMovements, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.movementsDone)
    user: User;

    @OneToOne(() => Treasury_Payments, (payment) => payment.movementGenerated)
    payment:Treasury_Payments;
  
    @ManyToOne(() => Treasury_TypeOfMovement, (movement) => movement.movements)
    type_of_movement: Treasury_TypeOfMovement;

    @Column('decimal', { precision: 16, scale: 8 })
    @IsNumber()
    amount: number;

}
