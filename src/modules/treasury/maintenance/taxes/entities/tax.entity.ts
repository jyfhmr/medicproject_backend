import { IsOptional } from 'class-validator';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity'; // Si tienes una entidad de Currency
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Treasury_maintenance_type_tax } from './typeTax.entity';

@Entity()
export class Treasury_maintenance_Tax {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Treasury_maintenance_type_tax, { nullable: true })
    typeTax: Treasury_maintenance_type_tax;

    @Column({ nullable: true })
    description: string;

    @Column()
    value: number;

    // Relacionar la moneda a una entidad de Currency
    @ManyToOne(() => Treasury_maintenance_Money, { nullable: true })
    @IsOptional()
    applicableCurrency?: Treasury_maintenance_Money; // Moneda aplicable al impuesto

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.taxsUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.taxs)
    user: User;
}
