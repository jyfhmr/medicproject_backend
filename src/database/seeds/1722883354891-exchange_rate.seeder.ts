import { Treasury_maintenance_exchangeRate } from 'src/modules/audits/exchange_rate/entities/exchange_rate.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class ExchangeRateSeeder1722883354891 implements Seeder {
    track = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const repository = dataSource.getRepository(Treasury_maintenance_exchangeRate);

        const exchange_rates = [
            {
                currencyId: { id: 1 },
                exchangeToCurrency: { id: 2 },
                isActive: true,
                exchange: 36,
                user: { id: 1 },
            },
            {
                currencyId: { id: 3 },
                exchangeToCurrency: { id: 2 },
                isActive: true,
                exchange: 40,
                user: { id: 1 },
            },
        ];

        await repository.save(exchange_rates);
    }
}
