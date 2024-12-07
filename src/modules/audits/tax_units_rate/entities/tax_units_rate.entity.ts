import { IsNumber } from 'class-validator';
import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('audits_tax_unit_rate')
export class TaxUnitsRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    value: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    providences: number;

    @Column({ type: 'timestamp' })
    taxDate: Date;

    @ManyToOne(() => User, (user) => user.taxUnitsRate)
    user: User;

    @ManyToOne(() => User, (user) => user.taxUnitsRateUpdated, { nullable: true })
    userUpdate?: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ nullable: true, type: 'timestamp' })
    updatedAt?: Date;

    @Column({ default: true })
    isActive: boolean;
}
