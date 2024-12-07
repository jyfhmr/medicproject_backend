import { forwardRef, Module } from '@nestjs/common';
import { DebitNoteSalesService } from './debit-note-sales.service';
import { DebitNoteSalesController } from './debit-note-sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebitNoteSale } from './entities/debit-note-sale.entity';
import { config_admistrative_reason } from 'src/modules/audits/reason/entities/reason.entity';
import { UsersModule } from 'src/modules/config/users/users.module';
import { ProvidersModule } from 'src/modules/masters/providers/providers.module';
import { MoneyModule } from 'src/modules/treasury/maintenance/money/money.module';
import { ReasonModule } from 'src/modules/audits/reason/reason.module';
import { ModuleModule } from 'src/modules/config/module/module.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DebitNoteSale, config_admistrative_reason]),
        UsersModule,
        forwardRef(() => MoneyModule),
        forwardRef(() => ProvidersModule),
        forwardRef(() => ReasonModule),
        forwardRef(() => ModuleModule),
        forwardRef(() => CorrelativeModule),
    ],
    controllers: [DebitNoteSalesController],
    providers: [DebitNoteSalesService],
    exports: [DebitNoteSalesService],
})
export class DebitNoteSalesModule {}
