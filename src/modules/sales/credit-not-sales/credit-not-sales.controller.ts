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
    Request,
    ConflictException,
} from '@nestjs/common';
import { CreditNotSalesService } from './credit-not-sales.service';
import { CreateCreditNotSaleDto } from './dto/create-credit-not-sale.dto';
import { UpdateCreditNotSaleDto } from './dto/update-credit-not-sale.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';

@Controller('sales/creditNote')
export class CreditNotSalesController {
    constructor(private readonly creditNotSalesService: CreditNotSalesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.creditNotSalesService.findAll(query);
        await this.creditNotSalesService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: number, @Res() res: Response) {
        const notaCredit = await this.findOne(id);
        await this.creditNotSalesService.generatePdfFromHtml(notaCredit, res);
    }

    @Post()
    async create(@Body() createCreditNotSaleDto: CreateCreditNotSaleDto, @Request() req: any) {
        console.log(createCreditNotSaleDto);
        try {
            return await this.creditNotSalesService.create(createCreditNotSaleDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listMoney() {
        return this.creditNotSalesService.listMoney();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.creditNotSalesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.creditNotSalesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCreditNotSaleDto: UpdateCreditNotSaleDto,
        @Request() req: any,
    ) {
        return this.creditNotSalesService.update(+id, updateCreditNotSaleDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.creditNotSalesService.changeStatus(id);
    }
}
