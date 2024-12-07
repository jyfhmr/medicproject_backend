import { Injectable } from '@nestjs/common';
import { CreateTypeOfMovementDto } from './dto/create-type_of_movement.dto';
import { UpdateTypeOfMovementDto } from './dto/update-type_of_movement.dto';

@Injectable()
export class TypeOfMovementService {
    create(createTypeOfMovementDto: CreateTypeOfMovementDto) {
        return 'This action adds a new typeOfMovement';
    }

    findAll() {
        return `This action returns all typeOfMovement`;
    }

    findOne(id: number) {
        return `This action returns a #${id} typeOfMovement`;
    }

    update(id: number, updateTypeOfMovementDto: UpdateTypeOfMovementDto) {
        return `This action updates a #${id} typeOfMovement`;
    }

    remove(id: number) {
        return `This action removes a #${id} typeOfMovement`;
    }
}
