import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdjuntesv2Dto } from './dto/create-adjuntesv2.dto';
import { UpdateAdjuntesv2Dto } from './dto/update-adjuntesv2.dto';
import { AdjunteV2 } from './entities/adjuntesv2.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicHistory } from '../clinic-history/entities/clinic-history.entity';
import { Http } from 'winston/lib/winston/transports';

@Injectable()
export class Adjuntesv2Service {
    constructor(
        // private dataSource: DataSource
        @InjectRepository(ClinicHistory)
        private clinicHistoryRepository: Repository<ClinicHistory>, // Repositorio de ClinicHistory.
        @InjectRepository(AdjunteV2)
        private adjuntesRepository: Repository<AdjunteV2>, // Repositorio de Adjunte.
    ) {}

    async create({ url, note, clinicHistoryId }: CreateAdjuntesv2Dto): Promise<AdjunteV2> {
        console.log('llegando....', clinicHistoryId);
        try {
            const clinicHistory = await this.clinicHistoryRepository.findOne({
                where: { id: clinicHistoryId },
            });

            if (!clinicHistory) {
                throw new Error('Clinic history not found');
            }

            const adjunte = await this.adjuntesRepository.create({
                url,
                note,
                clinicHistoryRelated: clinicHistory,
            });

            console.log('el adjunte guardado', adjunte);
            return this.adjuntesRepository.save(adjunte);
        } catch (error) {
            console.log('el error', error);
        }
    }

    async deleteBy(IdAdjunte: number) {
      try {
        await this.adjuntesRepository.delete(IdAdjunte)
      } catch (error) {
        throw new HttpException("No se pudo eliminar el adjunto",500)
      }
    }

    async updateMany(adjuntesToUpdate: any[]) {
        if (adjuntesToUpdate.length === 0) {
            console.log('No hay adjuntos que actualizar');
            return;
        }

    

        try {
            for (let i = 0; i < adjuntesToUpdate.length; i++) {
                const adjunteUpdated = await this.adjuntesRepository.update(
                    adjuntesToUpdate[i].id,
                    {
                        note: adjuntesToUpdate[i].note,
                    },
                );

                console.log('Adjunto actualizado', adjunteUpdated);
            }

            return true;
        } catch (error) {
            throw new HttpException('Error actualizando adjuntos', 500);
        }
    }

    findAll() {
        return `This action returns all adjuntesv2`;
    }

    findOne(id: number) {
        return `This action returns a #${id} adjuntesv2`;
    }

    update(id: number, updateAdjuntesv2Dto: UpdateAdjuntesv2Dto) {
        return `This action updates a #${id} adjuntesv2`;
    }

    remove(id: number) {
        return `This action removes a #${id} adjuntesv2`;
    }
}
