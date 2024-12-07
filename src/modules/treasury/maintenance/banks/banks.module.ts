import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treasury_maintenance_Bank } from './entities/bank.entity';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Treasury_maintenance_Bank]) ],
    controllers: [BanksController],
    providers: [BanksService],
    exports: [BanksService],
})
export class BanksModule {}
