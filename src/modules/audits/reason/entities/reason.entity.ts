import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { User } from 'src/modules/config/users/entities/user.entity';
import { purchasing_creditNote } from 'src/modules/purchasing/creditNote/entities/creditNote.entity';
import { DebitNote } from 'src/modules/purchasing/debit-note/entities/debit-note.entity';
import { CreditNotSale } from 'src/modules/sales/credit-not-sales/entities/credit-not-sale.entity';
import { DebitNoteSale } from 'src/modules/sales/debit-note-sales/entities/debit-note-sale.entity';

@Entity()
export class config_admistrative_reason {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description?: string;

    @Column()
    NameReason: string;

    @Column()
    module: string;

    // En la entidad donde motive puede tener muchas notas de crédito
    @OneToOne(() => purchasing_creditNote, (creditNote) => creditNote.motive)
    creditNotes: purchasing_creditNote; // Un motivo tiene muchas notas de crédito

    @OneToOne(() => CreditNotSale, (creditNotSale) => creditNotSale.motive)
    motiveSale: CreditNotSale;

    @OneToOne(() => DebitNote, (debitNote) => debitNote.motive)
    debitNote: DebitNote;

    @OneToOne(() => DebitNoteSale, (debitNoteSale) => debitNoteSale.motive)
    debitNoteSale: DebitNoteSale;

    @Column()
    transactionType: string;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateAt: Date;

    @Column({ default: true }) // Valor por defecto para isActive
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.PaymentMethodUpdated, { nullable: true })
    userUpdate?: User;

    @ManyToOne(() => User, (user) => user.paymentMethod)
    user: User;
}
