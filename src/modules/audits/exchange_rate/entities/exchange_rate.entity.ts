import { IsNumber } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Treasury_maintenance_Money } from '../../../treasury/maintenance/money/entities/money.entity';
import { User } from 'src/modules/config/users/entities/user.entity';

@Entity()
export class Treasury_maintenance_exchangeRate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Treasury_maintenance_Money)
    currencyId: Treasury_maintenance_Money;

    @ManyToOne(() => Treasury_maintenance_Money) //usualmente será el bolívar
    exchangeToCurrency: Treasury_maintenance_Money;

    @Column('decimal', { precision: 16, scale: 8 })
    @IsNumber()
    exchange: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => User, (user) => user.statuses)
    user: User;
}
