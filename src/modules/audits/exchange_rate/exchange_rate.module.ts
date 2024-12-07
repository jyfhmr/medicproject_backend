import { Module, forwardRef } from '@nestjs/common';
import { ExchangeRateService } from './exchange_rate.service';
import { ExchangeRateController } from './exchange_rate.controller';
import { Treasury_maintenance_exchangeRate } from './entities/exchange_rate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyModule } from '../../treasury/maintenance/money/money.module';
import { ScrappingServiceModule } from '../../treasury/maintenance/scrapping_service/scrapping_service.module';
import { UsersModule } from 'src/modules/config/users/users.module';
import { SocketModule } from 'src/socket/socket.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Treasury_maintenance_exchangeRate]),
        UsersModule,
        MoneyModule,
        forwardRef(() => ScrappingServiceModule),
        SocketModule,
    ],
    controllers: [ExchangeRateController],
    providers: [ExchangeRateService],
    exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
