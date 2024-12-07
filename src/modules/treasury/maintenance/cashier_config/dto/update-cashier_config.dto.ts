import { PartialType } from '@nestjs/swagger';
import { CreateCashierConfigDto } from './create-cashier_config.dto';

export class UpdateCashierConfigDto extends PartialType(CreateCashierConfigDto) {}
