import { Controller, Get, Post, Body, Patch, Param, Request, Query, Res } from '@nestjs/common';
import { TaxUnitsRateService } from './tax_units_rate.service';
import { CreateTaxUnitsRateDto } from './dto/create-tax_units_rate.dto';
import { UpdateTaxUnitsRateDto } from './dto/update-tax_units_rate.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('audits/tax_units_rate')
export class TaxUnitsRateController {
    constructor(private readonly taxUnitsRateService: TaxUnitsRateService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        const data: any = await this.taxUnitsRateService.findAll(query);
        await this.taxUnitsRateService.exportDataToExcel(data.data, res);
    }

    @Post()
    create(@Body() createTaxUnitsRateDto: CreateTaxUnitsRateDto, @Request() req: any) {
        console.log('PETICION LLEGANDO el valor', createTaxUnitsRateDto.value);
        return this.taxUnitsRateService.create(createTaxUnitsRateDto, req.user.sub);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.taxUnitsRateService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taxUnitsRateService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaxUnitsRateDto: UpdateTaxUnitsRateDto) {
        return this.taxUnitsRateService.update(+id, updateTaxUnitsRateDto);
    }

    @Patch(':id/change_status')
    change_status(@Param('id') id: string) {
        return this.taxUnitsRateService.changeStatus(+id);
    }
}
