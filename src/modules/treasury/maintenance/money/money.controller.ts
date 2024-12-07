import {
    Controller,
    Get,
    Post,
    Body,
    Res,
    Patch,
    Param,
    Query,
    ParseIntPipe,
    UploadedFile,
    Request,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MoneyService } from './money.service';
import { CreateMoneyDto } from './dto/create-money.dto';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { v4 as uuidv4 } from 'uuid';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import * as multer from 'multer';

@Controller('treasury/maintenance/money')
export class MoneyController {
    constructor(private readonly moneyService: MoneyService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.moneyService.findAll(query);
        await this.moneyService.exportDataToExcel(data.data, res);
    }
    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.memoryStorage(), // Guardar el archivo en memoria para facilitar la lectura
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xls|xlsx)$/)) {
                    return cb(new BadRequestException('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Llamar al servicio para procesar el archivo Excel
        return this.moneyService.processExcel(file.buffer);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/money',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueSuffix);
                },
            }),
        }),
    )
    create(
        @Body() createMoneyDto: CreateMoneyDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
    ) {
        if (file) {
            createMoneyDto.file = file.filename; // Save the filename in the DTO
        }
        return this.moneyService.create(createMoneyDto, req.user.sub);
    }

    @Post("getPaymentMethodRelatedToCertainCurrency")
    getPaymentMethodRelatedToCertainCurrency(
        @Request() req: any
    ){

        console.log("EL id que llega desde el front",req.body.id)

        return this.moneyService.getPaymentMethodRelatedToCertainCurrency(req.body.id)
    }

    @Get('list')
    listMoney() {
        return this.moneyService.listMoney();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.moneyService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.moneyService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/money',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueSuffix);
                },
            }),
        }),
    )
    update(
        @Param('id') id: string,
        @Body() updateMoneyDto: UpdateMoneyDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
    ) {
        if (file) {
            updateMoneyDto.file = file.filename; // Save the filename in the DTO
        }
        return this.moneyService.update(+id, updateMoneyDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.moneyService.changeStatus(id);
    }
}
