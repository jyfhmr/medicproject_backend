import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import {Response} from "express"
import { Public } from 'src/decorators/isPublic.decorator';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}


  @Public()
  @Post()
  create(@Body() createPdfDto: any, @Res() res: Response) {
    return this.pdfService.generatePdfFromHtml(createPdfDto,res);
  }

  @Get()
  findAll() {
    return this.pdfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePdfDto: UpdatePdfDto) {
    return this.pdfService.update(+id, updatePdfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdfService.remove(+id);
  }
}
