import { Module } from '@nestjs/common';
import { TaxUnitsRateService } from './tax_units_rate.service';
import { TaxUnitsRateController } from './tax_units_rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxUnitsRate } from './entities/tax_units_rate.entity';
import { UsersModule } from 'src/modules/config/users/users.module';
@Module({
    imports: [TypeOrmModule.forFeature([TaxUnitsRate]), UsersModule],
    controllers: [TaxUnitsRateController],
    providers: [TaxUnitsRateService],
})
export class TaxUnitsRateModule {}
