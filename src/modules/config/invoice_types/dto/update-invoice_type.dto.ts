import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceTypeDto } from './create-invoice_type.dto';

export class UpdateInvoiceTypeDto extends PartialType(CreateInvoiceTypeDto) {}
