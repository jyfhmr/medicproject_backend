import { Injectable } from '@nestjs/common';
import { CreateCorrelativeDto } from './dto/create-correlative.dto';
import { UpdateCorrelativeDto } from './dto/update-correlative.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Correlative } from './entities/correlative.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CorrelativeService {
    // create(createCorrelativeDto: CreateCorrelativeDto) {
    //     return 'This action adds a new correlative';
    // }

    constructor(
        @InjectRepository(Correlative)
        private readonly correlativoRepository: Repository<Correlative>,
    ) {}

    async generateCode(module: string, subModule: string): Promise<string> {
        const año = new Date().getFullYear();
        const mes = new Date().getMonth() + 1; // En JS, los meses son de 0-11
        const hoy = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // Formato 'ymd'

        let codigoAct: string;

        const correlativo: any = await this.correlativoRepository.findOne({
            where: { module, subModule, currentYear: año.toString(), currentMonth: mes.toString() },
        });

        if (correlativo) {
            const corre = parseInt(correlativo?.correlative);

            console.log('Si lleha0');
            console.log(`${correlativo.currentYear} === ${año.toString()}`);
            console.log(`${correlativo.currentMonth} === ${mes.toString()}`);
            if (
                correlativo.currentYear === año.toString() &&
                correlativo.currentMonth === mes.toString()
            ) {
                if (corre > 998) {
                    const codigo = `${module}${hoy}001`;
                    await this.correlativoRepository.update(
                        {
                            module,
                            subModule,
                            currentYear: año.toString(),
                            currentMonth: mes.toString(),
                        },
                        { correlative: 1, currentCode: codigo },
                    );
                } else if (corre < 999) {
                    const codigo = `${module}${hoy}${this.formarNumero(corre + 1)}`;
                    await this.correlativoRepository.update(
                        {
                            module,
                            subModule,
                            currentYear: año.toString(),
                            currentMonth: mes.toString(),
                        },
                        { correlative: corre + 1, currentCode: codigo },
                    );
                }
            } else {
                const codigo = `${module}${hoy}001`;
                await this.correlativoRepository.insert({
                    module,
                    subModule,
                    correlative: 1,
                    currentYear: año.toString(),
                    currentMonth: mes.toString(),
                    currentCode: codigo,
                });
            }

            codigoAct = correlativo.currentCode;
        } else {
            const codigo = `${module}${hoy}0001`;
            const codigo2 = `${module}${hoy}0002`;

            await this.correlativoRepository.insert({
                module,
                subModule,
                correlative: 2,
                currentYear: año.toString(),
                currentMonth: mes.toString(),
                currentCode: codigo2,
            });

            codigoAct = codigo;
            console.log('Si llega');
        }

        return codigoAct;
    }

    formarNumero(numero: number): string {
        if (numero < 10) {
            return `000${numero}`;
        } else if (numero >= 10 && numero <= 99) {
            return `00${numero}`;
        } else if (numero >= 100 && numero <= 999) {
            return `0${numero}`;
        }
        return numero.toString();
    }
}
