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
import { PaymentConceptsService } from './payment_concepts.service';
import { CreatePaymentConceptDto } from './dto/create-payment_concept.dto';
import { UpdatePaymentConceptDto } from './dto/update-payment_concept.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('audits/payment_concepts')
export class PaymentConceptsController {
    constructor(private readonly paymentConceptsService: PaymentConceptsService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.paymentConceptsService.findAll(query);
        await this.paymentConceptsService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(@Body() createPaymentConceptDto: CreatePaymentConceptDto, @Request() req: any) {
        try {
            return await this.paymentConceptsService.create(createPaymentConceptDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.paymentConceptsService.findAll(query);
    }

    @Get('list')
    listPaymentConcept() {
        return this.paymentConceptsService.listPaymentConcept();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentConceptsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePaymentConceptDto: UpdatePaymentConceptDto,
        @Request() req: any,
    ) {
        return this.paymentConceptsService.update(+id, updatePaymentConceptDto, req.user.sub);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.paymentConceptsService.changeStatus(id);
    }
}
