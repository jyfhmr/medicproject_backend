import { HttpException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/modules/config/users/users.service';

@Injectable()
export class PatientService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
    ) {}

    create(createPatientDto: CreatePatientDto) {
        //create
        //console.log('body de la petición', createPatientDto);

        try {
            //Crea la instancia del registro
            const newPatient = this.patientRepository.create(createPatientDto);

            //se guarda la data
            this.patientRepository.save(newPatient);

            return newPatient;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Error al crear el paciente', 500);
            }
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Patient[] }> {
        console.log('recibiendo el findall de patient');
        console.log('el query : ', query);

        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const queryBuilder = this.patientRepository
            .createQueryBuilder('patientAlias')
            .leftJoinAndSelect('patientAlias.user', 'user')
            .andWhere('patientAlias.isActive = :isActive', { isActive: true });

        if (query.createdAt) {
            const [startDate, endDate] = query.createdAt.split(',');
            queryBuilder.andWhere('patientAlias.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }

        //Si el parámetro existe busca por el parámetro, sino solo traeme los pacientes activos
        if (query.isActive !== undefined) {
            const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
            queryBuilder.andWhere('patientAlias.isActive = :isActive', {
                isActive: isActive,
            });
        }

        if (query.patientDni) {
            queryBuilder.andWhere('patientAlias.dni = :dni', {
                dni: query.patientDni,
            });
        }

        if (query.patientName) {
            queryBuilder.andWhere('LOWER(patientAlias.name) LIKE :patientName', {
                patientName: `%${query.patientName.toLowerCase()}%`,
            });
        }

        if (query.isActive !== undefined) {
            const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
            queryBuilder.andWhere('patientAlias.isActive = :isActive', { isActive: isActive });
        }

        const [totalRows, data] = await Promise.all([
            queryBuilder.getCount(),
            query?.export
                ? queryBuilder.orderBy('patientAlias.id', order).getMany()
                : queryBuilder.orderBy('patientAlias.id', order).skip(skip).take(take).getMany(),
        ]);

        return { totalRows, data };
    }

    async findAllOfThem() {
        try {
            const patients = await this.patientRepository.find();
            //console.log('patients', patients);
            return patients;
        } catch (error) {
            console.log('el error', error);
            throw new HttpException('No se pudo hacer fetch de todos los pacientes', 500);
        }
    }

    async findByDni(dni: string) {
        if (!dni) {
            throw new HttpException('No fue proporcionado un DNI correcto', 401);
        }

        console.log('buscando por el dni', dni);
        try {
            const patient = await this.patientRepository.findOne({
                where: { dni: dni },
            });

            if (!patient) {
                throw new HttpException('No se encontró al paciente', 404);
            }

            return patient;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            // Si el error es de otro tipo, maneja una respuesta genérica
            console.error('error buscando por cédula', error);
            throw new HttpException('Error interno al buscar un paciente por cédula', 500);
        }
    }

    async findOne(id: number) {
        const patient = await this.patientRepository.findOne({ where: { id } });

        if (!patient) {
            throw new HttpException('No se encontró al paciente', 404);
        }

        return patient;
    }

    async update(id: number, updatePatientDto: UpdatePatientDto) {
        try {
            // Encuentro al paciente por su id
            const patientToUpdate = await this.findOne(id);

            // Actualizo el paciente
            const updatedPatient = this.patientRepository.merge(patientToUpdate, updatePatientDto);

            // Guardo el paciente actualizado
            this.patientRepository.save(updatedPatient);

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            // Si el error es de otro tipo, maneja una respuesta genérica
            console.error('error actualizando el paciente', error);
            throw new HttpException('Error interno al actualizar el paciente', 500);
        }
    }

    async remove(id: number) {
        try {
            const patientToDelete = await this.findOne(id);

            patientToDelete.isActive = false;
            this.patientRepository.save(patientToDelete);

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            // Si el error es de otro tipo, maneja una respuesta genérica
            console.error('error eliminando el paciente', error);
            throw new HttpException('Error interno al eliminar el paciente', 500);
        }
    }
}
