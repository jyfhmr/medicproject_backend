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
import { CashierConfigService } from './cashier_config.service';
import { CreateCashierConfigDto } from './dto/create-cashier_config.dto';
import { UpdateCashierConfigDto } from './dto/update-cashier_config.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';

@Controller('treasury/maintenance/cashier_config')
export class CashierConfigController {
    constructor(private readonly cashierConfigService: CashierConfigService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.cashierConfigService.findAll(query);
        await this.cashierConfigService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: number, @Res() res: Response) {
        const notaCredit = await this.findOne(id);
        await this.cashierConfigService.generatePdfFromHtml(notaCredit, res);
    }



    @Post()
    async create(@Body() createCashierConfigDto: CreateCashierConfigDto, @Request() req: any) {
        try {
            return await this.cashierConfigService.create(createCashierConfigDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Post("findRegisterCashiersWithThisCurrencyId")
    async findRegisterCashiersWithThisCurrencyId(@Body() moneyId: any, @Request() req: any) {
        console.log(" el money id que está llegando",moneyId)
        try {
            return await this.cashierConfigService.findRegisterCashiersWithThisCurrencyId(moneyId.id);
        } catch (error) {
           
            console.log("el error",error)
        }
    }


    @Get()
    findAll(@Query() query: any) {
        return this.cashierConfigService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cashierConfigService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCashierConfigDto: UpdateCashierConfigDto,
        @Request() req: any,
    ) {
        return this.cashierConfigService.update(+id, updateCashierConfigDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.cashierConfigService.changeStatus(id);
    }
}
