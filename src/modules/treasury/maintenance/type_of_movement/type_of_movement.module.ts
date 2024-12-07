import { Module } from '@nestjs/common';
import { TypeOfMovementService } from './type_of_movement.service';
import { TypeOfMovementController } from './type_of_movement.controller';

@Module({
  controllers: [TypeOfMovementController],
  providers: [TypeOfMovementService],
})
export class TypeOfMovementModule {}
