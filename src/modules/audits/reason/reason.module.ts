import { forwardRef, Module } from '@nestjs/common';
import { ReasonController } from './reason.controller';
import { ReasonService } from './reason.service';
import { UsersModule } from 'src/modules/config/users/users.module';
import { config_admistrative_reason } from 'src/modules/audits/reason/entities/reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditNoteModule } from 'src/modules/purchasing/creditNote/creditNote.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([config_admistrative_reason]),
        UsersModule,
        forwardRef(() => CreditNoteModule),
    ],
    controllers: [ReasonController],
    providers: [ReasonService],
})
export class ReasonModule {}
