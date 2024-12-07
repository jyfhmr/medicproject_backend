import { HttpException, Injectable } from '@nestjs/common';
import { CreateClinicHistoryDto } from './dto/create-clinic-history.dto';
import { UpdateClinicHistoryDto } from './dto/update-clinic-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicHistory } from './entities/clinic-history.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/modules/config/users/users.service';
import { Patient } from '../patient/entities/patient.entity';
import { User } from 'src/modules/config/users/entities/user.entity';
import { Adjunte } from '../adjuntes/entities/adjunte.entity';

@Injectable()
export class ClinicHistoryService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(ClinicHistory)
        private clinicHistoryRepository: Repository<ClinicHistory>,

        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,

        
        private dataSource: DataSource,

        @InjectRepository(Adjunte)
        private adjuntesRepository: Repository<Adjunte>,
    ) {}

    async create(createClinicHistoryDto: CreateClinicHistoryDto, userId: number) {
        //create
        //console.log('body de la petición', createClinicHistoryDto);

        try {
            //Crea la instancia del registro
            const newClinicHistory = await this.clinicHistoryRepository.create();

            //verifica la existencia de los datos patientId y userId
            const existances = await this.verifyExistence(userId, createClinicHistoryDto.patientId);

            //Genera el número de consulta
            const getConsultNumber = await this.getConsultNumber(existances);

            //console.log('el consult number', getConsultNumber);

            //Genera la data y la formatea para ser insertada
            const data = await this.formatBody(
                createClinicHistoryDto,
                newClinicHistory,
                getConsultNumber,
                existances.patient,
                existances.user,
            );



            //se guarda la data
            const savedRecord = await this.clinicHistoryRepository.save(data);

            return savedRecord.id;
        } catch (error) {
            // Verifica si el error es una instancia de HttpException y la vuelve a lanzar
            if (error instanceof HttpException) {
                throw error;
            }

            // Si el error es de otro tipo, maneja una respuesta genérica
            console.error('Error al crear el registro de historia clínica:', error);
            throw new HttpException('Error interno en el servidor', 500);
        }
    }

    async formatBody(
        body: CreateClinicHistoryDto,
        clinicHistoryInstance: ClinicHistory,
        consultNumber: number,
        patient: Patient,
        user: User,
    ) {
        clinicHistoryInstance = {
            ...clinicHistoryInstance,
            ...body, // Copia todas las propiedades de `body`
            patient: patient,
            consultNumber: consultNumber,
            user: user,
        };

        //console.log('el clinic history instance', clinicHistoryInstance);

        return clinicHistoryInstance;
    }

    async getConsultNumber(existances: any) {
        //Cuento cuantas consultas han habido para ese paciente con el usuario especifico
        //si han habido 3, pues esta seria la consulta 4, le sumo 1 al count
        //si hay 0, esta seria la primera, le sumo 1 y sería la primera consulta

        const count = await this.clinicHistoryRepository.query(
            `
              SELECT COUNT(*) FROM clinic_history WHERE userId = ? AND patientId = ?;
          `,
            [existances.user.id, existances.patient.id],
        );

        var countNumber = Number(count[0]['COUNT(*)']);

        return countNumber + 1;
    }

    async verifyExistence(userId?: number, patientId?: number) {
        const response: any = {};

        if (userId) {
            const userMakingTheConsult = await this.usersService.findOne(userId);

            if (!userMakingTheConsult) {
                throw new HttpException('No se encontró el usuario', 404);
            }

            response.user = userMakingTheConsult;
        }

        //console.log('el patient id que se está buscnado aaa', patientId);

        if (patientId) {
            const patient = await this.patientRepository.findOne({ where: { id: patientId } });

            //console.log('el paciente', patient);

            if (!patient) {
                throw new HttpException('No se encontró el paciente proporcionado', 404);
            }

            response.patient = patient;
        }

        return response;
    }

    async findAll(query: any): Promise<{ totalRows: number; data: ClinicHistory[] }> {
        console.log('recibiendo al findall ');
        console.log('el query : ', query);

        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const queryBuilder = this.clinicHistoryRepository
            .createQueryBuilder('clinicHistoryAlias')
            .leftJoinAndSelect('clinicHistoryAlias.patient', 'patient')
            .leftJoinAndSelect('clinicHistoryAlias.user', 'user')
            // .leftJoinAndSelect("clinicHistoryAlias.adjuntes","adjuntes")

        if (query.createdAt) {
            const [startDate, endDate] = query.createdAt.split(',');
            queryBuilder.andWhere('clinicHistoryAlias.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }

        if (query.patientDni) {
            queryBuilder.andWhere('patient.dni = :dni', {
                dni: query.patientDni,
            });
        }

        if (query.consultNumber) {
            queryBuilder.andWhere('clinicHistoryAlias.consultNumber = :consultNumber', {
                consultNumber: query.consultNumber,
            });
        }

        //Si el parámetro existe busca por el parámetro, sino solo traeme las citas activas
        if (query.isActive !== undefined) {
            const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
            queryBuilder.andWhere('clinicHistoryAlias.isActive = :isActive', {
                isActive: isActive,
            });
        }

        if (query.patientName) {
            queryBuilder.andWhere('LOWER(patient.name) LIKE :patientName', {
                patientName: `%${query.patientName.toLowerCase()}%`,
            });
        }

        const [totalRows, data] = await Promise.all([
            queryBuilder.getCount(),
            query?.export
                ? queryBuilder.orderBy('clinicHistoryAlias.id', order).getMany()
                : queryBuilder
                      .orderBy('clinicHistoryAlias.id', order)
                      .skip(skip)
                      .take(take)
                      .getMany(),
        ]);

        return { totalRows, data };
    }

    async findOne(id: number) {
        const clinicHistory = await this.clinicHistoryRepository.findOne({
            where: { id },
            relations: ['user', 'patient',"adjuntesV2"],
        });

        if (!clinicHistory) {
            throw new HttpException('La historia clínica buscada no se encontró', 404);
        }

        console.log("clinci history",clinicHistory)
        return clinicHistory;
    }

    async update(id: number, updateClinicHistoryDto: UpdateClinicHistoryDto) {
        try {
            //encuentro el registro que quiero editar
            const clinicHistoryToUpdate = await this.findOne(id);

            //encuentro el paciente al que se le quiere asignar la cita,
            const patient = await this.patientRepository.findOne({
                where: { id: updateClinicHistoryDto.patientId },
            });
            if (!patient) {
                throw new HttpException('Paciente no encontrado', 404);
            }

            //asigno al nuevo paciente
            clinicHistoryToUpdate.patient = patient;

            //actualizo el registro
            const updatedClinicHistory = this.clinicHistoryRepository.merge(
                clinicHistoryToUpdate,
                updateClinicHistoryDto,
            );

            //lo guardo
            const clinicHistoryUpdated = await this.clinicHistoryRepository.save(updatedClinicHistory);

            return clinicHistoryUpdated.id;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            // Si el error es de otro tipo, maneja una respuesta genérica
            console.error('Error al editar un registro de historia clínica:', error);
            throw new HttpException('Error interno en el servidor editando una historia', 500);
        }
    }

    async findConsultNumber(patientId: number, userId: number) {
        const idToFind = Number(patientId);

        console.log('PATIENT ID', patientId);

        // Encuentra el último registro de la clínica de un paciente y usuario
        const clinicHistory = await this.clinicHistoryRepository.findOne({
            where: {
                patient: { id: idToFind },
                user: { id: userId },
            },
            //select: ['consultNumber'],
            order: {
                createdAt: 'DESC', // Ordenar por fecha de creación, en orden descendente (más reciente primero)
            },
        });

        if (!clinicHistory) {
            return 1;
        }

        console.log('clinic history', clinicHistory);
        return clinicHistory.consultNumber + 1;
    }

    async changeStatus(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const clinicHistoryToUpdate = await this.findOne(id);

            const isActive = !clinicHistoryToUpdate.isActive;
            const { user, patient, consultNumber } = clinicHistoryToUpdate;

            // Actualizar el estado del registro actual
            await queryRunner.manager.update('clinic_history', { id }, { isActive });

            if (!isActive) {
                // Caso de inactivación: reducir el número de las citas posteriores
                await queryRunner.manager.query(
                    `
                    UPDATE clinic_history
                    SET consultNumber = consultNumber - 1
                    WHERE userId = ? AND patientId = ? AND consultNumber > ?
                `,
                    [user.id, patient.id, consultNumber],
                );
            } else {
                //A todas las consultas posteriores les sumo 1, menos a la propia,
                //se usa el >= en el consultNumber en el caso de que desactives la penultima

                console.log('Activnado de vuelta...', user.id, patient.id, consultNumber);
                console.log('Para citas con consultNumber mayor a', consultNumber);

                // Caso de activación: incrementar el número de las citas posteriores
                await queryRunner.manager.query(
                    `
                    UPDATE clinic_history
                    SET consultNumber = consultNumber + 1
                    WHERE userId = ? AND patientId = ? AND consultNumber >= ? AND id != ?
                `,
                    [user.id, patient.id, consultNumber, id],
                );
            }

            await queryRunner.commitTransaction();
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error al cambiar el estado de una historia:', error);
            throw new HttpException('Error interno en el servidor', 500);
        } finally {
            await queryRunner.release();
        }
    }

    remove(id: number) {
        return `This action removes a #${id} clinicHistory`;
    }
}
