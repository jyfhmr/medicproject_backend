import { Global, Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';

@Global()
@Module({
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
