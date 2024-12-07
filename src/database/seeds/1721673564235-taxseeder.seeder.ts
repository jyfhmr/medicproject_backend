import { Treasury_maintenance_type_tax } from 'src/modules/treasury/maintenance/taxes/entities/typeTax.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TaxseederSeeder1721673564235 implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const typeTax = dataSource.getRepository(Treasury_maintenance_type_tax);

        const tax = [
            { typeTax: 'Alicuota Adicional / Impuesto al Consumo de Compras', isActive: true },
            { typeTax: 'Alicuota Adicional / Impuesto al Consumo de Ventas', isActive: true },
            { typeTax: 'Alicuota General / IVA Compras', isActive: true },
            { typeTax: 'Alicuota General / IVA Ventas', isActive: true },
            { typeTax: 'Alicuota Reducida en Compras', isActive: true },
            { typeTax: 'Alicuota Reducida en Ventas', isActive: true },
            { typeTax: 'Impuesto sobre Fletes', isActive: true },
            {
                typeTax: 'Impuesto IGTF (Impuesto a Grandes Transacciones Financieras)',
                isActive: true,
            },
            { typeTax: 'Retención IVA', isActive: true },
            { typeTax: 'Retención ISLR', isActive: true },
        ];

        await typeTax.save(tax);
    }
}
