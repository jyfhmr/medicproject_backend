import { PartialType } from '@nestjs/swagger';
import { CreateTypesPeopleIsrlDto } from './create-types_people_isrl.dto';

export class UpdateTypesPeopleIsrlDto extends PartialType(CreateTypesPeopleIsrlDto) {}
