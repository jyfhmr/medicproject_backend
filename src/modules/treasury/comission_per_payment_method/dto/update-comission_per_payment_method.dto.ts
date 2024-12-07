import { PartialType } from '@nestjs/swagger';
import { CreateComissionPerPaymentMethodDto } from './create-comission_per_payment_method.dto';

export class UpdateComissionPerPaymentMethodDto extends PartialType(CreateComissionPerPaymentMethodDto) {}
