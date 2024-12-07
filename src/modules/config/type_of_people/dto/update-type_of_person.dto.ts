import { PartialType } from '@nestjs/swagger';
import { CreateTypeOfPersonDto } from './create-type_of_person.dto';

export class UpdateTypeOfPersonDto extends PartialType(CreateTypeOfPersonDto) {}
