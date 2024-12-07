import { PartialType } from '@nestjs/swagger';
import { CreateCashiersTreasuryDto } from './create-cashiers_treasury.dto';

export class UpdateCashiersTreasuryDto extends PartialType(CreateCashiersTreasuryDto) {}
