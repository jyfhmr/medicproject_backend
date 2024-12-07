import { PartialType } from '@nestjs/swagger';
import { CreateAdjunteDto } from './create-adjunte.dto';

export class UpdateAdjunteDto extends PartialType(CreateAdjunteDto) {}
