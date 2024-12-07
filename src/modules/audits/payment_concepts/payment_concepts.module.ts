import { Module } from '@nestjs/common';
import { PaymentConceptsService } from './payment_concepts.service';
import { PaymentConceptsController } from './payment_concepts.controller';
import { UsersModule } from 'src/modules/config/users/users.module';
import { config_admistrative_paymentConcept } from 'src/modules/audits/payment_concepts/entities/payment_concept.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesOrPorcentageModule } from '../rates_or_porcentage/rates_or_porcentage.module';
import { TypesPeopleIsrlModule } from '../types_people_isrl/types_people_isrl.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([config_admistrative_paymentConcept]),
        UsersModule,
        RatesOrPorcentageModule,
        TypesPeopleIsrlModule,
    ],
    controllers: [PaymentConceptsController],
    providers: [PaymentConceptsService],
})
export class PaymentConceptsModule {}
