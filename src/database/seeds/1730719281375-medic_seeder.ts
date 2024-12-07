import { Patient } from 'src/modules/medic/patient/entities/patient.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MedicSeeder1730719281375 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {

        const patientRepository = dataSource.getRepository(Patient);

        patientRepository.insert({name: "Paciente de Prueba", dni: "29555543"})

    }
}
