import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { purchasing_creditNote } from 'src/modules/purchasing/creditNote/entities/creditNote.entity';

@Entity()
export class Config_Module {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column()
    color?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.configModuleUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.configModule)
    user: User;

    // relaciones

}
