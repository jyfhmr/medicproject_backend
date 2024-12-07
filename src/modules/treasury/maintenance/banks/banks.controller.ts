import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    ParseIntPipe,
    Res,
    Request,
    ConflictException,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('treasury/maintenance/banks')
export class BanksController {
    constructor(private readonly banksService: BanksService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.banksService.findAll(query);
        await this.banksService.exportDataToExcel(data.data, res);
    }
    @Post()
    async create(@Body() createBankDto: CreateBankDto, @Request() req: any) {
        try {
            return await this.banksService.create(createBankDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.banksService.findAll(query);
    }

    @Get("/getBanksWithAccounts")
    getBanksWithAccounts(@Query() query: any) {
        return this.banksService.findBanksWithAccounts();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.banksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto, @Request() req: any) {
        return this.banksService.update(+id, updateBankDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.banksService.changeStatus(id);
    }
}
