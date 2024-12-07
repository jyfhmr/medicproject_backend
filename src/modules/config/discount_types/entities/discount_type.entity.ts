import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('config_admistrative_discount_types')
export class DiscountType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    isActive: boolean;
}
