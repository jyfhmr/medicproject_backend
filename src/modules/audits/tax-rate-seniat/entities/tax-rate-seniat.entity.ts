import { IsNumber, IsString } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';

@Entity('audits_tax_rate_seniat')
export class TaxRateSeniat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 20, scale: 4 })
    @IsNumber()
    value: number;

    @Column()
    @IsString()
    description: string;

    @ManyToOne(() => User, (user) => user.taxRateSeniat)
    user: User;

    @ManyToOne(() => User, (user) => user.taxRateSeniatUpdated, { nullable: true })
    userUpdate?: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ nullable: true, type: 'timestamp' })
    updatedAt?: Date;

    @Column({ default: true })
    isActive: boolean;
}
