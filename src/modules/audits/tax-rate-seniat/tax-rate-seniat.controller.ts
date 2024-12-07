import { Controller, Get, Post, Body, Patch, Param, Request, Query, Res } from '@nestjs/common';
import { TaxRateSeniatService } from './tax-rate-seniat.service';
import { CreateTaxRateSeniatDto } from './dto/create-tax-rate-seniat.dto';
import { UpdateTaxRateSeniatDto } from './dto/update-tax-rate-seniat.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('audits/taxRateSeniat')
export class TaxRateSeniatController {
    constructor(private readonly taxRateSeniatService: TaxRateSeniatService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        const data: any = await this.taxRateSeniatService.findAll(query);
        await this.taxRateSeniatService.exportDataToExcel(data.data, res);
    }

    @Post()
    create(@Body() createTaxRateSeniatDto: CreateTaxRateSeniatDto, @Request() req: any) {
        console.log('PETICION LLEGANDO el valor', createTaxRateSeniatDto.value);
        return this.taxRateSeniatService.create(createTaxRateSeniatDto, req.user.sub);
    }

    @Get()
    findAll(@Query() query: any) {
        console.log(' llegando ');
        return this.taxRateSeniatService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taxRateSeniatService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaxRateSeniatDto: UpdateTaxRateSeniatDto) {
        return this.taxRateSeniatService.update(+id, updateTaxRateSeniatDto);
    }

    @Patch(':id/change_status')
    change_status(@Param('id') id: string) {
        return this.taxRateSeniatService.changeStatus(+id);
    }
}
