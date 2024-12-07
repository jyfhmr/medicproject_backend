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
import { CreditNoteService } from './creditNote.service';
import { CreateCreditNoteDto } from './dto/create-creditNote.dto';
import { UpdateCreditNoteDto } from './dto/update-creditNote.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';

@Controller('purchasing/creditNote')
export class CreditNoteController {
    constructor(private readonly creditNoteService: CreditNoteService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.creditNoteService.findAll(query);
        await this.creditNoteService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Get('generate-from-html/:id')
    async generatePdfFromHtml(@Param('id') id: number, @Res() res: Response) {
        const notaCredit = await this.findOne(id);
        await this.creditNoteService.generatePdfFromHtml(notaCredit, res);
    }

    @Post()
    async create(@Body() createCreditNoteDto: CreateCreditNoteDto, @Request() req: any) {
        console.log(createCreditNoteDto);
        try {
            return await this.creditNoteService.create(createCreditNoteDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listMoney() {
        return this.creditNoteService.listMoney();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.creditNoteService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.creditNoteService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCreditNoteDto: UpdateCreditNoteDto,
        @Request() req: any,
    ) {
        return this.creditNoteService.update(+id, updateCreditNoteDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.creditNoteService.changeStatus(id);
    }
}
