import { IsInt, IsNumber } from 'class-validator';
import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RatesOrPorcentage } from '../../rates_or_porcentage/entities/rates_or_porcentage.entity';

@Entity('config_administrative_rates2_range')
export class Rates2Range {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RatesOrPorcentage, (ratesOrPorcentage) => ratesOrPorcentage.rates2Range)
    rateOrPorcentage: RatesOrPorcentage;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    minimumAmountPaid: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    maximumAmountPaid: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    retentionPorcentage: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    @IsInt()
    sustractingUT: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    sustractingBs: number;

    @ManyToOne(() => User, (user) => user.rates2Range)
    user: User;

    @ManyToOne(() => User, (user) => user.rates2RangeUpdated, { nullable: true })
    userUpdate?: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ nullable: true, type: 'timestamp' })
    updatedAt?: Date;

    @Column({ default: true })
    isActive: boolean;
}
