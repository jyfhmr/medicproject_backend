import { Treasury_TypeOfMovement } from 'src/modules/treasury/maintenance/type_of_movement/entities/type_of_movement.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TypeOfMovements1729541685549 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {

        const repository = dataSource.getRepository(Treasury_TypeOfMovement);

        const typeOfMovements = [
            {
                id: 1,
                type_of_movement: "INGRESO"
            },
            {
                id: 2,
                type_of_movement: "EGRESO"
            },
        ];
        await repository.save(typeOfMovements);

    }
}
