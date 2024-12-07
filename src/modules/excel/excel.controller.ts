import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';


@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Public()
  @Post("downloadView")
  downloadView(@Body() dataFromFrontend:any,@Res() res: Response) {
    return this.excelService.createForExcelForView(dataFromFrontend,res);
  }

}
