import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { config_admistrative_paymentConcept } from '../../payment_concepts/entities/payment_concept.entity';
import { TypesPeopleIsrl } from '../../types_people_isrl/entities/types_people_isrl.entity';
import { RatesOrPorcentage } from '../../rates_or_porcentage/entities/rates_or_porcentage.entity';
import { IsNumber } from 'class-validator';

@Entity('config_admistrative_isrl_witholdings')
export class IsrlWitholding {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => config_admistrative_paymentConcept, (paymentConcept) => paymentConcept.id)
    paymentConcept?: config_admistrative_paymentConcept;

    @ManyToOne(() => TypesPeopleIsrl, (typesPeopleIsrl) => typesPeopleIsrl.id)
    typesPeopleIsrl?: TypesPeopleIsrl;

    @ManyToOne(() => RatesOrPorcentage, (ratesOrPorcentage) => ratesOrPorcentage.id)
    ratesOrPorcentage?: RatesOrPorcentage;

    @Column()
    codeSeniat: string;

    @Column('decimal', { precision: 16, scale: 8 })
    @IsNumber()
    taxBase: number;

    @Column('decimal', { precision: 16, scale: 8, nullable: true })
    @IsNumber()
    pageRangeBS: number;

    @Column('decimal', { precision: 16, scale: 8, nullable: true })
    @IsNumber()
    sustractingBS: number;
}
