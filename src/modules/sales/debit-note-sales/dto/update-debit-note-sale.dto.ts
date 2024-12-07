import { PartialType } from '@nestjs/swagger';
import { CreateDebitNoteSaleDto } from './create-debit-note-sale.dto';

export class UpdateDebitNoteSaleDto extends PartialType(CreateDebitNoteSaleDto) {}
