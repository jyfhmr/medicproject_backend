import { forwardRef, Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { Config_Module } from './entities/module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditNoteModule } from 'src/modules/purchasing/creditNote/creditNote.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Config_Module]),
        UsersModule,
        forwardRef(() => CreditNoteModule),
    ],
    controllers: [ModuleController],
    providers: [ModuleService],
    exports: [ModuleService, TypeOrmModule],
})
export class ModuleModule {}
