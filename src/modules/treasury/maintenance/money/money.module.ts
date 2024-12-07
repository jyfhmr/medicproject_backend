import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_maintenance_Money } from './entities/money.entity';
import { UsersModule } from '../../../config/users/users.module';
import { TaxesModule } from '../../../treasury/maintenance/taxes/taxes.module';
import { CreditNoteModule } from 'src/modules/purchasing/creditNote/creditNote.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Treasury_maintenance_Money]),
        UsersModule,
        TaxesModule,
        CreditNoteModule,
    ],
    controllers: [MoneyController],
    providers: [MoneyService],
    exports: [MoneyService, TypeOrmModule],
})
export class MoneyModule {}
