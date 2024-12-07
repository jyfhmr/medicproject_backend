import { forwardRef, Module } from '@nestjs/common';
import { DebitNoteService } from './debit-note.service';
import { DebitNoteController } from './debit-note.controller';
import { MoneyModule } from 'src/modules/treasury/maintenance/money/money.module';
import { ProvidersModule } from 'src/modules/masters/providers/providers.module';
import { ReasonModule } from 'src/modules/audits/reason/reason.module';
import { ModuleModule } from 'src/modules/config/module/module.module';
import { CorrelativeModule } from 'src/modules/config/correlative/correlative.module';
import { UsersModule } from 'src/modules/config/users/users.module';
import { DebitNote } from './entities/debit-note.entity';
import { config_admistrative_reason } from 'src/modules/audits/reason/entities/reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([DebitNote, config_admistrative_reason]),
        UsersModule,
        forwardRef(() => MoneyModule),
        forwardRef(() => ProvidersModule),
        forwardRef(() => ReasonModule),
        forwardRef(() => ModuleModule),
        forwardRef(() => CorrelativeModule),
    ],
    controllers: [DebitNoteController],
    providers: [DebitNoteService],
    exports: [DebitNoteService],
})
export class DebitNoteModule {}
