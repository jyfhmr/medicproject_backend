import { forwardRef, Module } from '@nestjs/common';
import { AdjuntesService } from './adjuntes.service';
import { AdjuntesController } from './adjuntes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adjunte } from './entities/adjunte.entity';
import { ClinicHistoryModule } from '../clinic-history/clinic-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adjunte]),
    forwardRef(() => ClinicHistoryModule),
    // Importa el módulo de historias clínicas.
  ],
  controllers: [AdjuntesController],
  providers: [AdjuntesService],
  exports: [AdjuntesService]
})
export class AdjuntesModule {}
