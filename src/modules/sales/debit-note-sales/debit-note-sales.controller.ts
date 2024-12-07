import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Res,
    Request,
    ConflictException,
    ParseIntPipe,
} from '@nestjs/common';
import { DebitNoteSalesService } from './debit-note-sales.service';
import { CreateDebitNoteSaleDto } from './dto/create-debit-note-sale.dto';
import { UpdateDebitNoteSaleDto } from './dto/update-debit-note-sale.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('sales/debitNote')
export class DebitNoteSalesController {
    constructor(private readonly debitNoteSalesService: DebitNoteSalesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.debitNoteSalesService.findAll(query);
        await this.debitNoteSalesService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: number, @Res() res: Response) {
        const notaCredit = await this.findOne(id);
        await this.debitNoteSalesService.generatePdfFromHtml(notaCredit, res);
    }

    @Post()
    async create(@Body() createDebitNoteSaleDto: CreateDebitNoteSaleDto, @Request() req: any) {
        try {
            return await this.debitNoteSalesService.create(createDebitNoteSaleDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listMoney() {
        return this.debitNoteSalesService.listMoney();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.debitNoteSalesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.debitNoteSalesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateDebitNoteSaleDto: UpdateDebitNoteSaleDto,
        @Request() req: any,
    ) {
        return this.debitNoteSalesService.update(+id, updateDebitNoteSaleDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.debitNoteSalesService.changeStatus(id);
    }
}
