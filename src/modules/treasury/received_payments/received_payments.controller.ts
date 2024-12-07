import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceivedPaymentsService } from './received_payments.service';
import { CreateReceivedPaymentDto } from './dto/create-received_payment.dto';
import { UpdateReceivedPaymentDto } from './dto/update-received_payment.dto';

@Controller('treasury/received_payments')
export class ReceivedPaymentsController {
  constructor(private readonly receivedPaymentsService: ReceivedPaymentsService) {}

  @Post()
  create(@Body() createReceivedPaymentDto: CreateReceivedPaymentDto) {
    return this.receivedPaymentsService.create(createReceivedPaymentDto);
  }

  @Get()
  findAll() {

    console.log("recibiendo en pagos recibidos")

    return this.receivedPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivedPaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceivedPaymentDto: UpdateReceivedPaymentDto) {
    return this.receivedPaymentsService.update(+id, updateReceivedPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receivedPaymentsService.remove(+id);
  }
}
