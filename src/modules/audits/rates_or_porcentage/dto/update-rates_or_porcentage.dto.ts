import { PartialType } from '@nestjs/swagger';
import { CreateRatesOrPorcentageDto } from './create-rates_or_porcentage.dto';

export class UpdateRatesOrPorcentageDto extends PartialType(CreateRatesOrPorcentageDto) {}
