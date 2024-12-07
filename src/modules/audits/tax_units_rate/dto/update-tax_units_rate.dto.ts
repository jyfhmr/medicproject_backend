import { PartialType } from '@nestjs/swagger';
import { CreateTaxUnitsRateDto } from './create-tax_units_rate.dto';

export class UpdateTaxUnitsRateDto extends PartialType(CreateTaxUnitsRateDto) {}
