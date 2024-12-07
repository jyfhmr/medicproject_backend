import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    Query,
    Res,
} from '@nestjs/common';
import { Rates2RangesService } from './rates2_ranges.service';
import { CreateRates2RangeDto } from './dto/create-rates2_range.dto';
import { UpdateRates2RangeDto } from './dto/update-rates2_range.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('audits/rates2_ranges')
export class Rates2RangesController {
    constructor(private readonly rates2RangesService: Rates2RangesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        const data: any = await this.rates2RangesService.findAll(query);
        await this.rates2RangesService.exportDataToExcel(data.data, res);
    }

    @Post()
    create(@Body() createRates2RangeDto: CreateRates2RangeDto, @Request() req: any) {
        console.log('valores recibidos al crear rango', createRates2RangeDto);
        return this.rates2RangesService.create(createRates2RangeDto, req.user.sub);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.rates2RangesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rates2RangesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRates2RangeDto: UpdateRates2RangeDto) {
        return this.rates2RangesService.update(+id, updateRates2RangeDto);
    }

    @Patch(':id/change_status')
    change_status(@Param('id') id: string, @Body() updateRates2RangeDto: UpdateRates2RangeDto) {
        return this.rates2RangesService.changeStatus(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rates2RangesService.remove(+id);
    }
}
