import { Module } from '@nestjs/common';
import { TaxpayerTypesService } from './taxpayer-types.service';
import { TaxpayerTypesController } from './taxpayer-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxpayerType } from './entities/taxpayer-type.entity';
import { UsersModule } from 'src/modules/config/users/users.module';
import { TaxpayerTypePorcentage } from './entities/taxpayer_type_porcentage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaxpayerType, TaxpayerTypePorcentage]) ],
    controllers: [TaxpayerTypesController],
    providers: [TaxpayerTypesService],
})
export class TaxpayerTypesModule {}
