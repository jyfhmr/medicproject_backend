import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    ConflictException,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { InvoiceTypesService } from './invoice_types.service';
import { CreateInvoiceTypeDto } from './dto/create-invoice_type.dto';
import { UpdateInvoiceTypeDto } from './dto/update-invoice_type.dto';

@Controller('config/administrative/invoice-types')
export class InvoiceTypesController {
    constructor(private readonly invoiceTypesService: InvoiceTypesService) {}

    @Post()
    async create(@Body() createInvoiceTypeDto: CreateInvoiceTypeDto, @Request() req: any) {
        try {
            return await this.invoiceTypesService.create(createInvoiceTypeDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listTypes() {
        return this.invoiceTypesService.listTypes();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.invoiceTypesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoiceTypesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInvoiceTypeDto: UpdateInvoiceTypeDto) {
        return this.invoiceTypesService.update(+id, updateInvoiceTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.invoiceTypesService.remove(+id);
    }

    // @Patch(':id/change_status')
    // changeStatus(@Param('id', ParseIntPipe) id: number) {
    //     return this.invoiceTypesService.changeStatus(id);
    // }
}
