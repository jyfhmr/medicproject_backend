import { User } from 'src/modules/config/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('config_admistrative_invoice_types')
export class InvoiceType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    isActive: boolean;
}
