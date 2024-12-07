import { Module } from '@nestjs/common';
import { CorrelativeService } from './correlative.service';
import { CorrelativeController } from './correlative.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Correlative } from './entities/correlative.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Correlative])],
    controllers: [CorrelativeController],
    providers: [CorrelativeService],
    exports: [CorrelativeService]
})
export class CorrelativeModule {}
