import { Injectable } from '@nestjs/common';
import { CreateAdjunteDto } from './dto/create-adjunte.dto';
import { UpdateAdjunteDto } from './dto/update-adjunte.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicHistory } from '../clinic-history/entities/clinic-history.entity';
import { Repository } from 'typeorm';
import { Adjunte } from './entities/adjunte.entity';

@Injectable()
export class AdjuntesService {
  constructor(
    // private dataSource: DataSource
    @InjectRepository(ClinicHistory)
    private clinicHistoryRepository: Repository<ClinicHistory>, // Repositorio de ClinicHistory.
    @InjectRepository(Adjunte)
    private adjuntesRepository: Repository<Adjunte>, // Repositorio de Adjunte.

) {}


  async create({ url, note, clinicHistoryId }: CreateAdjunteDto): Promise<Adjunte> {
    console.log("llegando....",clinicHistoryId)
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
  
      console.log("el adjunte guardado",adjunte)
      return this.adjuntesRepository.save(adjunte);
  
    } catch (error) {
      console.log("el error",error)
    }
  
  }
  

  findAll() {
    return `This action returns all adjuntes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adjunte`;
  }

  update(id: number, updateAdjunteDto: UpdateAdjunteDto) {
    return `This action updates a #${id} adjunte`;
  }

  remove(id: number) {
    return `This action removes a #${id} adjunte`;
  }
}
