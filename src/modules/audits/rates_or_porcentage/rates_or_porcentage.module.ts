import { Module } from '@nestjs/common';
import { RatesOrPorcentageService } from './rates_or_porcentage.service';
import { RatesOrPorcentageController } from './rates_or_porcentage.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesOrPorcentage } from './entities/rates_or_porcentage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RatesOrPorcentage]), UsersModule],
    controllers: [RatesOrPorcentageController],
    providers: [RatesOrPorcentageService],
    exports: [TypeOrmModule],
})
export class RatesOrPorcentageModule {}
