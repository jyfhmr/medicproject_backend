import { forwardRef, Module } from '@nestjs/common';
import { ClinicHistoryService } from './clinic-history.service';
import { ClinicHistoryController } from './clinic-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistory } from './entities/clinic-history.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Adjunte } from '../adjuntes/entities/adjunte.entity';
import { AdjuntesModule } from '../adjuntes/adjuntes.module';
import { Adjuntesv2Module } from '../adjuntesv2/adjuntesv2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicHistory,Patient,Adjunte]),
    forwardRef(() => AdjuntesModule),
    Adjuntesv2Module
  ],
  controllers: [ClinicHistoryController],
  providers: [ClinicHistoryService],
  exports: [
    TypeOrmModule, // Exporta TypeOrmModule para que otros módulos puedan usar las entidades.
  ],
})
export class ClinicHistoryModule {}
