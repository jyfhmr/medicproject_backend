import { User } from "src/modules/config/users/entities/user.entity";

export class CreateMovementDto {

    idPayment: number

    type_of_movement: string

    amount: number;

    userId: number

}
