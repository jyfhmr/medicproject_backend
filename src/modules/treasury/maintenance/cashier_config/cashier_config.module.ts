import { forwardRef, Module } from '@nestjs/common';
import { CashierConfigService } from './cashier_config.service';
import { CashierConfigController } from './cashier_config.controller';
import { CashierConfig } from './entities/cashier_config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/config/users/users.module';
import { MoneyModule } from '../money/money.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CashierConfig]),
        UsersModule,
        forwardRef(() => MoneyModule),
    ],
    controllers: [CashierConfigController],
    providers: [CashierConfigService],
    exports: [CashierConfigService],
})
export class CashierConfigModule {}
