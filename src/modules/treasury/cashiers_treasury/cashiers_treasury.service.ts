import { Injectable } from '@nestjs/common';
import { CreateCashiersTreasuryDto } from './dto/create-cashiers_treasury.dto';
import { UpdateCashiersTreasuryDto } from './dto/update-cashiers_treasury.dto';

@Injectable()
export class CashiersTreasuryService {
  create(createCashiersTreasuryDto: CreateCashiersTreasuryDto) {
    return 'This action adds a new cashiersTreasury';
  }

  findAll() {
    return `This action returns all cashiersTreasury`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashiersTreasury`;
  }

  update(id: number, updateCashiersTreasuryDto: UpdateCashiersTreasuryDto) {
    return `This action updates a #${id} cashiersTreasury`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashiersTreasury`;
  }
}
