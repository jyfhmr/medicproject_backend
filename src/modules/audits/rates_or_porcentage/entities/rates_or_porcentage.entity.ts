import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Rates2Range } from '../../rates2_ranges/entities/rates2_range.entity';

@Entity()
export class RatesOrPorcentage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @Column({ nullable: true })
    valueNumber: number;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.ratesOrPorcentageUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.ratesOrPorcentage)
    user: User;

    @OneToMany(() => Rates2Range, (rates2Range) => rates2Range.rateOrPorcentage)
    rates2Range: Rates2Range;
}

