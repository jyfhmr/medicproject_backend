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
import { PaymentMethodService } from './payment_method.service';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';

@Controller('treasury/maintenance/payment_method')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        console.log('object');
        const data: any = await this.paymentMethodService.findAll(query);
        await this.paymentMethodService.exportDataToExcel(data.data, res);
    }

    @Post()
    async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto, @Request() req: any) {
        console.log('object');
        try {
            return await this.paymentMethodService.create(createPaymentMethodDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    findAll(@Query() query: any) {
        return this.paymentMethodService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentMethodService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
        @Request() req: any,
    ) {
        return this.paymentMethodService.update(+id, updatePaymentMethodDto, req.user.sub);
    }
    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.paymentMethodService.changeStatus(id);
    }
}
