import { Module } from '@nestjs/common';
import { TaxRateSeniatService } from './tax-rate-seniat.service';
import { TaxRateSeniatController } from './tax-rate-seniat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxRateSeniat } from './entities/tax-rate-seniat.entity';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([TaxRateSeniat]), UsersModule],
    controllers: [TaxRateSeniatController],
    providers: [TaxRateSeniatService],
})
export class TaxRateSeniatModule {}
