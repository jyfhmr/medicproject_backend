import { PartialType } from '@nestjs/swagger';
import { CreatePaymentConceptDto } from './create-payment_concept.dto';

export class UpdatePaymentConceptDto extends PartialType(CreatePaymentConceptDto) {}
