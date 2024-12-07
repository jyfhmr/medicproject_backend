import { PartialType } from '@nestjs/swagger';
import { CreateCorrelativeDto } from './create-correlative.dto';

export class UpdateCorrelativeDto extends PartialType(CreateCorrelativeDto) {}
