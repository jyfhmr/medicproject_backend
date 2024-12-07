import { Module } from '@nestjs/common';
import { Adjuntesv2Service } from './adjuntesv2.service';
import { Adjuntesv2Controller } from './adjuntesv2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistory } from '../clinic-history/entities/clinic-history.entity';
import { AdjunteV2 } from './entities/adjuntesv2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicHistory,AdjunteV2])],
  controllers: [Adjuntesv2Controller],
  providers: [Adjuntesv2Service],
  exports: [Adjuntesv2Service]
})
export class Adjuntesv2Module {}
