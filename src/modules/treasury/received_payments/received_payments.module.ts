import { Module } from '@nestjs/common';
import { ReceivedPaymentsService } from './received_payments.service';
import { ReceivedPaymentsController } from './received_payments.controller';

@Module({
  controllers: [ReceivedPaymentsController],
  providers: [ReceivedPaymentsService],
})
export class ReceivedPaymentsModule {}
