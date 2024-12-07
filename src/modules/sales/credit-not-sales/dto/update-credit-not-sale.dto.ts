import { PartialType } from '@nestjs/swagger';
import { CreateCreditNotSaleDto } from './create-credit-not-sale.dto';

export class UpdateCreditNotSaleDto extends PartialType(CreateCreditNotSaleDto) {}
