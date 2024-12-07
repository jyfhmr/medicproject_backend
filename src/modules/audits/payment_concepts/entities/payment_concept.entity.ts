import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { IsrlWitholding } from './isrl_witholding.entity';
import { Provider } from 'src/modules/masters/providers/entities/provider.entity';

@Entity()
export class config_admistrative_paymentConcept {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    numeroLiteral: string;
    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @OneToMany(() => IsrlWitholding, (isrlWitholding) => isrlWitholding.paymentConcept, {
        cascade: true,
    })
    IsrlWitholdings: IsrlWitholding[];

    @ManyToOne(() => User, (user) => user.paymentConceptUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.paymentConcept)
    user: User;

    @ManyToMany(() => Provider, (provider) => provider.paymentConcepts)
    providers: Provider[];
}
