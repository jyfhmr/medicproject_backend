import { PartialType } from '@nestjs/swagger';
import { CreateReceivedPaymentDto } from './create-received_payment.dto';

export class UpdateReceivedPaymentDto extends PartialType(CreateReceivedPaymentDto) {}
