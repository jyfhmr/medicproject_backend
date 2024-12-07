import { PartialType } from '@nestjs/swagger';
import { CreateAdjuntesv2Dto } from './create-adjuntesv2.dto';

export class UpdateAdjuntesv2Dto extends PartialType(CreateAdjuntesv2Dto) {}
