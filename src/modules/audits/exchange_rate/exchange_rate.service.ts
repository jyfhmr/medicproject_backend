import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange_rate.dto';
// import { UpdateExchangeRateDto } from './dto/update-exchange_rate.dto';
import { Treasury_maintenance_exchangeRate } from './entities/exchange_rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Treasury_maintenance_Money } from '../../treasury/maintenance/money/entities/money.entity';
import { ScrappingServiceService } from '../../treasury/maintenance/scrapping_service/scrapping_service.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import { SocketGateway } from 'src/socket/socket/socket.gateway';

@Injectable()
export class ExchangeRateService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Treasury_maintenance_exchangeRate)
        private exchangeRepository: Repository<Treasury_maintenance_exchangeRate>,
        @InjectRepository(Treasury_maintenance_Money)
        private moneyRepository: Repository<Treasury_maintenance_Money>,
        @Inject(forwardRef(() => ScrappingServiceService))
        private readonly scrappingServiceService: ScrappingServiceService,
        private dataSource: DataSource,
        private readonly socketGateway: SocketGateway,
    ) {}

    async create(
        createExchangeRateDto: CreateExchangeRateDto,
        userId: number,
        fromScrapping?: boolean,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Todas las operaciones de búsqueda y validación se realizan dentro de la transacción
            const user = await this.usersService.findOne(userId);
            const currency = await queryRunner.manager.findOne(Treasury_maintenance_Money, {
                where: { id: createExchangeRateDto.currencyId },
            });
            const exchangeToCurrency = await queryRunner.manager.findOne(
                Treasury_maintenance_Money,
                {
                    where: { id: createExchangeRateDto.exchangeToCurrency },
                },
            );

            if (!currency || !exchangeToCurrency) {
                throw new HttpException(
                    'Una o ambas monedas seleccionadas para la tasa no existen',
                    404,
                );
            }
            if (isNaN(createExchangeRateDto.exchange)) {
                throw new HttpException('No se recibió correctamente la tasa', 401);
            }

            // Comprobar si ya existe una tasa de cambio igual
            const existingRate = await queryRunner.manager.findOne(
                Treasury_maintenance_exchangeRate,
                {
                    where: {
                        currencyId: { id: createExchangeRateDto.currencyId },
                        exchangeToCurrency: { id: createExchangeRateDto.exchangeToCurrency },
                        exchange: createExchangeRateDto.exchange,
                        isActive: true,
                    },
                },
            );

            //console.log("Existing RATE",existingRate)

            if (existingRate) {
                throw new HttpException('La tasa de cambio ya existe y está activa', 409);
            }

            // Desactivar tasas de cambio anteriores
            await queryRunner.manager.update(
                Treasury_maintenance_exchangeRate,
                {
                    currencyId: { id: createExchangeRateDto.currencyId },
                    exchangeToCurrency: { id: createExchangeRateDto.exchangeToCurrency },
                    isActive: true,
                },
                { isActive: false },
            );

            // Crear y guardar la nueva tasa de cambio
            const exchange_rate = new Treasury_maintenance_exchangeRate();
            exchange_rate.user = user;
            exchange_rate.currencyId = currency;
            exchange_rate.exchangeToCurrency = exchangeToCurrency;
            exchange_rate.exchange = createExchangeRateDto.exchange;
            exchange_rate.isActive = true;

            await queryRunner.manager.save(Treasury_maintenance_exchangeRate, exchange_rate);

            // Confirmar la transacción
            await queryRunner.commitTransaction();

            if (fromScrapping) {
                this.socketGateway.server.emit(
                    `successExchangeChange`,
                    `{"currency": "${currency.symbol}", "rate": ${exchange_rate.exchange} }`,
                );
            }

            return '¡Tasa de cambio creada con éxito!';
        } catch (error) {
            //console.log('ERROR GUARDANDO LA TASA:', error);
            // Revertir la transacción en caso de error
            await queryRunner.rollbackTransaction();
            throw new HttpException(error.message, error.status);
        } finally {
            // Liberar el queryRunner
            await queryRunner.release();
        }
    }

    async findAll(
        query: any,
    ): Promise<{ totalRows: number; data: Treasury_maintenance_exchangeRate[] }> {
        console.log('recibiendo al findall ');
        console.log('el query : ', query);

        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const queryBuilder = this.exchangeRepository
            .createQueryBuilder('exchangeRate')
            .leftJoinAndSelect('exchangeRate.currencyId', 'currencyId')
            .leftJoinAndSelect('exchangeRate.exchangeToCurrency', 'exchangeToCurrency')
            .leftJoinAndSelect('exchangeRate.user', 'user');

        if (query.currencyId) {
            queryBuilder.andWhere('currencyId.money = :currencyId', {
                currencyId: query.currencyId,
            });
        }
        if (query.exchangeToCurrency) {
            queryBuilder.andWhere('exchangeToCurrency.money = :exchangeToCurrency', {
                exchangeToCurrency: query.exchangeToCurrency,
            });
        }
        if (query.isActive !== undefined) {
            const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
            queryBuilder.andWhere('exchangeRate.isActive = :isActive', { isActive: isActive });
        }
        if (query.exchange) {
            queryBuilder.andWhere('exchangeRate.exchange LIKE :exchange', {
                exchange: `%${query.exchange}%`,
            });
        }
        if (query.createdAt) {
            const [startDate, endDate] = query.createdAt.split(',');
            queryBuilder.andWhere('exchangeRate.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }

        const [totalRows, data] = await Promise.all([
            queryBuilder.getCount(),
            query?.export
                ? queryBuilder.orderBy('exchangeRate.id', order).getMany()
                : queryBuilder.orderBy('exchangeRate.id', order).skip(skip).take(take).getMany(),
        ]);

        return { totalRows, data };
    }

    async findOne(id: number): Promise<Treasury_maintenance_exchangeRate> {
        return await this.exchangeRepository.findOne({
            where: { id },
            relations: ['currencyId', 'exchangeToCurrency'],
        });
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.exchangeRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;
        try {
            await this.exchangeRepository.save(updateStatus);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.addRow(['Reporte de Tasas de Cambio']);
        worksheet.columns = [
            { header: 'Fecha de Creación', key: 'createdAt', width: 25 },
            { header: 'Moneda de Referencia:', key: 'currencyId', width: 20 },
            { header: 'Moneda transformada:', key: 'exchangeToCurrency', width: 20 },
            { header: 'Tasa de cambio:', key: 'exchange', width: 20 },
            { header: 'Registrado por', key: 'user', width: 20 },
        ];

        // Aplicar estilos a la cabecera
        worksheet.getRow(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2a953d' },
        };
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };

        // Agregar datos y aplicar estilos
        data.forEach((item) => {
            const flattenedItem = {
                createdAt: item.createdAt,
                exchangeToCurrency: item.exchangeToCurrency ? item.exchangeToCurrency.money : '',
                currencyId: item.currencyId ? item.currencyId.money : '',
                exchange: item.exchange,
                user: item.user.name,
            };

            const row = worksheet.addRow(flattenedItem);

            row.alignment = { vertical: 'middle', horizontal: 'left' };
            row.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Configurar el encabezado de la respuesta HTTP
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

        // Escribir el libro de trabajo en la respuesta HTTP
        await workbook.xlsx.write(res);
        res.end();
    }

    async findActiveExchangeRates(): Promise<Treasury_maintenance_exchangeRate[]> {
        const result: Treasury_maintenance_exchangeRate[] = [];

        const firstCondition = await this.exchangeRepository.findOne({
            where: {
                currencyId: { id: 1 },
                exchangeToCurrency: { id: 2 },
                isActive: true,
            },
            relations: ['currencyId', 'exchangeToCurrency'],
        });

        if (firstCondition) {
            result.push(firstCondition);
        }

        const secondCondition = await this.exchangeRepository.findOne({
            where: {
                currencyId: { id: 3 },
                exchangeToCurrency: { id: 2 },
                isActive: true,
            },
            relations: ['currencyId', 'exchangeToCurrency'],
        });

        if (secondCondition) {
            result.push(secondCondition);
        }

        //console.log("entregando tasas actuales",result)

        return result;
    }
}
