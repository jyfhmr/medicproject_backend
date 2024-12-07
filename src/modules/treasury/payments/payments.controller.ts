import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, ParseIntPipe, UseInterceptors, UploadedFile, UsePipes, Res, HttpException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ParsePaymentPipe } from './parse-payment/parse-payment.pipe';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('treasury/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Public()
  @Get('export')
  async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
    query.export = 1;
    const data: any = await this.paymentsService.findAll(query);
    console.log('Exporting data:', data);
    this.paymentsService.exportDataToExcel(data.data, res)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/payments',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  @UsePipes(ParsePaymentPipe) // Aplica el pipe aquí
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req: any, @UploadedFile() file: Express.Multer.File,) {

    console.log("llegando al controlador")

    if (file) {
      createPaymentDto.file = file.filename; // Save the filename in the DTO
    }

    return this.paymentsService.create(createPaymentDto, req.user.sub);
  }

  @Get()
  findAll(@Query() query: any) {

    
    //throw new HttpException("error personalizado",599)
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/payments',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      updatePaymentDto.voucher_image_url = file.filename; // Guardamos el nombre de la imagen en el DTO
    }
    return this.paymentsService.update(+id, updatePaymentDto, req.user.sub);
  }

  @Patch(':id/change_status')
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.changeStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}

