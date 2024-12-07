import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComissionPerPaymentMethodService } from './comission_per_payment_method.service';
import { CreateComissionPerPaymentMethodDto } from './dto/create-comission_per_payment_method.dto';
import { UpdateComissionPerPaymentMethodDto } from './dto/update-comission_per_payment_method.dto';

@Controller('comission-per-payment-method')
export class ComissionPerPaymentMethodController {
  constructor(private readonly comissionPerPaymentMethodService: ComissionPerPaymentMethodService) {}

  @Post()
  create(@Body() createComissionPerPaymentMethodDto: CreateComissionPerPaymentMethodDto) {
    return this.comissionPerPaymentMethodService.create(createComissionPerPaymentMethodDto);
  }

  @Get()
  findAll() {
    return this.comissionPerPaymentMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comissionPerPaymentMethodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComissionPerPaymentMethodDto: UpdateComissionPerPaymentMethodDto) {
    return this.comissionPerPaymentMethodService.update(+id, updateComissionPerPaymentMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comissionPerPaymentMethodService.remove(+id);
  }
}
