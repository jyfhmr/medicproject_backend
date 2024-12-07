import { Status } from 'src/modules/config/status/entities/status.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class StatusSeeder1726770256000 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {


        const repository = dataSource.getRepository(Status);

        const kind_of_statuses = [
            {
                status: "POR CONFIRMAR",
                module: "PAGOS HECHOS",
                color: "#60f4ff",
                user: { id: 1 },
            },
            {
                status: "CONFIRMADO",
                module: "PAGOS HECHOS",
                color: "#00ff63",
                user: { id: 1 },
            },,
        ];

        await repository.save(kind_of_statuses);
    }
}
