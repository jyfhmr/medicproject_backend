import { Module } from '@nestjs/common';
import { CashiersTreasuryService } from './cashiers_treasury.service';
import { CashiersTreasuryController } from './cashiers_treasury.controller';

@Module({
  controllers: [CashiersTreasuryController],
  providers: [CashiersTreasuryService],
})
export class CashiersTreasuryModule {}
