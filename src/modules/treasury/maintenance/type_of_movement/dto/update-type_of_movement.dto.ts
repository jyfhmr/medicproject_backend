import { PartialType } from '@nestjs/swagger';
import { CreateTypeOfMovementDto } from './create-type_of_movement.dto';

export class UpdateTypeOfMovementDto extends PartialType(CreateTypeOfMovementDto) {}
