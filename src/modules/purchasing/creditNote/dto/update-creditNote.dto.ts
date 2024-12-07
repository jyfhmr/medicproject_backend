import { PartialType } from '@nestjs/swagger';
import { CreateCreditNoteDto } from './create-creditNote.dto';

export class UpdateCreditNoteDto extends PartialType(CreateCreditNoteDto) {}
