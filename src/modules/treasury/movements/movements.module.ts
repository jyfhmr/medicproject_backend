import { forwardRef, Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PaymentsModule } from '../payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_Movements } from './entities/movement.entity';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Treasury_Movements]),forwardRef(() => PaymentsModule), UsersModule],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports:[MovementsService]
})
export class MovementsModule {}
