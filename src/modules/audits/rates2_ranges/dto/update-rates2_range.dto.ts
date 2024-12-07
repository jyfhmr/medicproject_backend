import { PartialType } from '@nestjs/swagger';
import { CreateRates2RangeDto } from './create-rates2_range.dto';

export class UpdateRates2RangeDto extends PartialType(CreateRates2RangeDto) {}
