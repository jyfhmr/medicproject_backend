import { Module } from '@nestjs/common';
import { ComissionPerPaymentMethodService } from './comission_per_payment_method.service';
import { ComissionPerPaymentMethodController } from './comission_per_payment_method.controller';

@Module({
  controllers: [ComissionPerPaymentMethodController],
  providers: [ComissionPerPaymentMethodService],
})
export class ComissionPerPaymentMethodModule {}
