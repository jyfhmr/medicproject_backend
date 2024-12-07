import { Module } from '@nestjs/common';
import { DiscountTypesService } from './discount_types.service';
import { DiscountTypesController } from './discount_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountType } from './entities/discount_type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DiscountType])],
    controllers: [DiscountTypesController],
    providers: [DiscountTypesService],
})
export class DiscountTypesModule {}
