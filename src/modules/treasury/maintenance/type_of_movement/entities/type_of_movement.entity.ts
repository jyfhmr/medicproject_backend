import { Treasury_Movements } from "src/modules/treasury/movements/entities/movement.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Treasury_TypeOfMovement {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type_of_movement: string;

    @OneToMany(() => Treasury_Movements, (movements) => movements.type_of_movement, { nullable: true })
    movements: Treasury_Movements[];

}
