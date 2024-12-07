import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashiersTreasuryService } from './cashiers_treasury.service';
import { CreateCashiersTreasuryDto } from './dto/create-cashiers_treasury.dto';
import { UpdateCashiersTreasuryDto } from './dto/update-cashiers_treasury.dto';

@Controller('cashiers-treasury')
export class CashiersTreasuryController {
  constructor(private readonly cashiersTreasuryService: CashiersTreasuryService) {}

  @Post()
  create(@Body() createCashiersTreasuryDto: CreateCashiersTreasuryDto) {
    return this.cashiersTreasuryService.create(createCashiersTreasuryDto);
  }

  @Get()
  findAll() {
    return this.cashiersTreasuryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashiersTreasuryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashiersTreasuryDto: UpdateCashiersTreasuryDto) {
    return this.cashiersTreasuryService.update(+id, updateCashiersTreasuryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashiersTreasuryService.remove(+id);
  }
}
