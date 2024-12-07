import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Request,
    Query,
    Res,
    ConflictException,
    ParseIntPipe,
} from '@nestjs/common';
import { RatesOrPorcentageService } from './rates_or_porcentage.service';
import { CreateRatesOrPorcentageDto } from './dto/create-rates_or_porcentage.dto';
import { UpdateRatesOrPorcentageDto } from './dto/update-rates_or_porcentage.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('audits/rates_or_porcentage')
export class RatesOrPorcentageController {
    constructor(private readonly ratesOrPorcentageService: RatesOrPorcentageService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.ratesOrPorcentageService.findAll(query);
        await this.ratesOrPorcentageService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(
        @Body() createRatesOrPorcentageDto: CreateRatesOrPorcentageDto,
        @Request() req: any,
    ) {
        try {
            return await this.ratesOrPorcentageService.create(
                createRatesOrPorcentageDto,
                req.user.sub,
            );
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.ratesOrPorcentageService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ratesOrPorcentageService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateRatesOrPorcentageDto: UpdateRatesOrPorcentageDto,
        @Request() req: any,
    ) {
        return this.ratesOrPorcentageService.update(+id, updateRatesOrPorcentageDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.ratesOrPorcentageService.changeStatus(id);
    }
}
