import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/config/users/users.module';
import { Catalogue } from '../../catalogue/entities/catalogue.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Catalogue]) ],
    controllers: [BrandsController],
    providers: [BrandsService],
})
export class BrandsModule {}
