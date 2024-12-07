import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment_method.service';
import { PaymentMethodController } from './payment_method.controller';
import { Treasury_maintenance_PaymentMethod } from './entities/payment_method.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Treasury_maintenance_PaymentMethod]) ],
    controllers: [PaymentMethodController],
    providers: [PaymentMethodService],
    exports: [PaymentMethodService]
})
export class PaymentMethodModule {}
