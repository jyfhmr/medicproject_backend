import { PartialType } from '@nestjs/swagger';
import { CreateDebitNoteDto } from './create-debit-note.dto';

export class UpdateDebitNoteDto extends PartialType(CreateDebitNoteDto) {}
