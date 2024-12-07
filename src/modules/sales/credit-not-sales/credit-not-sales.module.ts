import { CreditNotSalesService } from './credit-not-sales.service';
import { CreditNotSalesController } from './credit-not-sales.controller';

import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/config/users/users.module';
import { CreditNotSale } from './entities/credit-not-sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyModule } from 'src/modules/treasury/maintenance/money/money.module';
import { ProvidersModule } from 'src/modules/masters/providers/providers.module';
import { ReasonModule } from 'src/modules/audits/reason/reason.module';
import { config_admistrative_reason } from 'src/modules/audits/reason/entities/reason.entity';
import { ModuleModule } from 'src/modules/config/module/module.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CreditNotSale, config_admistrative_reason]),
        UsersModule,
        forwardRef(() => MoneyModule),
        forwardRef(() => ProvidersModule),
        forwardRef(() => ReasonModule),
        forwardRef(() => ModuleModule),
        forwardRef(() => CorrelativeModule),
    ],
    controllers: [CreditNotSalesController],
    providers: [CreditNotSalesService],
    exports: [CreditNotSalesService],
})
export class CreditNotSalesModule {}
