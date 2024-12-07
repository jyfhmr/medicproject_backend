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
import { DebitNoteService } from './debit-note.service';
import { CreateDebitNoteDto } from './dto/create-debit-note.dto';
import { UpdateDebitNoteDto } from './dto/update-debit-note.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('purchasing/debitNote')
export class DebitNoteController {
    constructor(private readonly debitNoteService: DebitNoteService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.debitNoteService.findAll(query);
        await this.debitNoteService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: number, @Res() res: Response) {
        const notaCredit = await this.findOne(id);
        await this.debitNoteService.generatePdfFromHtml(notaCredit, res);
    }

    @Post()
    async create(@Body() createDebitNoteDto: CreateDebitNoteDto, @Request() req: any) {
        try {
            return await this.debitNoteService.create(createDebitNoteDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listMoney() {
        return this.debitNoteService.listMoney();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.debitNoteService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.debitNoteService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateDebitNoteDto: UpdateDebitNoteDto,
        @Request() req: any,
    ) {
        return this.debitNoteService.update(+id, updateDebitNoteDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.debitNoteService.changeStatus(id);
    }
}
