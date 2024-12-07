import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { BanksModule } from 'src/modules/treasury/maintenance/banks/banks.module';
import { Treasury_maintenance_Account } from 'src/modules/treasury/maintenance/account/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComissionPerPaymentMethod } from '../../comission_per_payment_method/entities/comission_per_payment_method.entity';
import { PaymentMethodModule } from '../payment_method/payment_method.module';
import { MoneyModule } from '../money/money.module';

@Module({
    imports: [TypeOrmModule.forFeature([Treasury_maintenance_Account,ComissionPerPaymentMethod]) , BanksModule, PaymentMethodModule, MoneyModule],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
