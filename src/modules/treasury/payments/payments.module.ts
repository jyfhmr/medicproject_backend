import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_Payments } from './entities/payment.entity';
import { Treasury_maintenance_Money } from '../maintenance/money/entities/money.entity';
import { UsersModule } from 'src/modules/config/users/users.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';
import { MovementsModule } from '../movements/movements.module';
import { CashierConfigModule } from '../maintenance/cashier_config/cashier_config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Treasury_Payments]),TypeOrmModule.forFeature([Treasury_maintenance_Money]), UsersModule, CorrelativeModule, forwardRef(() => MovementsModule),CashierConfigModule ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
