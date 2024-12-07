import { PartialType } from '@nestjs/swagger';
import { CreateTaxRateSeniatDto } from './create-tax-rate-seniat.dto';

export class UpdateTaxRateSeniatDto extends PartialType(CreateTaxRateSeniatDto) {}
