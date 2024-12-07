import { InvoiceType } from '../../modules/config/invoice_types/entities/invoice_type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class InvoiceTypesSeeder1727964908771 implements Seeder {
    track = false;

    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(InvoiceType);

        const invoice_type = [
            {
                name: 'Contado',
            },
            {
                name: 'Crédito',
            },
            {
                name: 'Consignación',
            },
        ];
        await repository.save(invoice_type);
    }
}
