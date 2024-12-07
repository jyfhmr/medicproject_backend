import { TaxpayerType } from 'src/modules/masters/taxpayer-types/entities/taxpayer-type.entity';
import { TaxpayerTypePorcentage } from 'src/modules/masters/taxpayer-types/entities/taxpayer_type_porcentage.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TaxpayerTypesSeeder1719071514678 implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const taxpayerTypesRepository = dataSource.getRepository(TaxpayerType);
        const taxpayerTypesPorcentageRepository = dataSource.getRepository(TaxpayerTypePorcentage);

        const taxpayerTypes = [
            { name: 'ORDINARIO', user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'ESPECIAL', user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'FORMAL', user: { id: 1 }, userUpdate: { id: 1 } },
        ];
        await taxpayerTypesRepository.save(taxpayerTypes);

        const taxpayerTypesPorcentage = [
            { porcentage: 75, description: '75%', isActive: true },
            { porcentage: 100, description: '100%', isActive: true },
        ];
        await taxpayerTypesPorcentageRepository.save(taxpayerTypesPorcentage);
    }
}
