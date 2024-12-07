import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRates2RangeDto } from './dto/create-rates2_range.dto';
import { UpdateRates2RangeDto } from './dto/update-rates2_range.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rates2Range } from './entities/rates2_range.entity';
import { Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';

@Injectable()
export class Rates2RangesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Rates2Range) private rates2RangeRepository: Repository<Rates2Range>,
    ) {}

    async create(createRates2RangeDto: CreateRates2RangeDto, userId: number) {
        const user = await this.usersService.findOne(userId);
        createRates2RangeDto.user = user;
        createRates2RangeDto.userUpdate = user;

        try {
            await this.rates2RangeRepository.save(createRates2RangeDto);
            return '¡Rango de Tarifas creado!';
        } catch (error) {
            throw error;
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Rates2Range[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const where = this.buildWhereClause(query);

        try {
            const [resCount, resData] = await Promise.all([
                this.rates2RangeRepository.count({ where }),
                query?.export
                    ? this.rates2RangeRepository.find({
                          where,
                          order: { id: order },
                          relations: ['user', 'userUpdate'],
                      })
                    : this.rates2RangeRepository.find({
                          where,
                          order: { id: order },
                          take,
                          skip,
                          relations: ['user', 'userUpdate'],
                      }),
            ]);

            //console.log('data', resData);

            return {
                totalRows: resCount,
                data: resData,
            };
        } catch (error) {
            console.log(error);
            throw new HttpException('Error obtaining tax rates', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private buildWhereClause(query: any) {
        const where: any = {};

        // Filtro por estado activo
        if (query.isActive !== undefined) {
            where.isActive = query.isActive === 'true';
        }

        // Filtro por minimo
        if (query.minimumAmountPaid) {
            where.minimumAmountPaid = Raw(
                (alias) => `${alias} LIKE '%${query.minimumAmountPaid}%'`,
            );
        }

        // Filtro por maximo
        if (query.maximumAmountPaid) {
            where.maximumAmountPaid = Raw(
                (alias) => `${alias} LIKE '%${query.maximumAmountPaid}%'`,
            );
        }

        // Filtro por maximo
        if (query.retentionPorcentage) {
            where.retentionPorcentage = Raw(
                (alias) => `${alias} LIKE '%${query.retentionPorcentage}%'`,
            );
        }

        // Filtro por maximo
        if (query.sustractingUT) {
            where.sustractingUT = Raw((alias) => `${alias} LIKE '%${query.sustractingUT}%'`);
        }

        if (query.sustractingBs) {
            where.sustractingBs = Raw((alias) => `${alias} LIKE '%${query.sustractingBs}%'`);
        }

        // Filtro por rango de fechas en createdAt
        if (query.createdAt) {
            const [startDate, endDate] = query.createdAt.split(',');
            where.createdAt = Raw(
                (createdAt) =>
                    `${createdAt} BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(endDate).toISOString()}'`,
            );
        }

        // Filtro por rango de fechas en updatedAt
        if (query.updatedAt) {
            const [startDate, endDate] = query.updatedAt.split(',');
            where.updatedAt = Raw(
                (updatedAt) =>
                    `${updatedAt} BETWEEN '${new Date(startDate).toISOString()}' AND '${new Date(endDate).toISOString()}'`,
            );
        }

        return where;
    }

    async findOne(id: number): Promise<Rates2Range> {
        return await this.rates2RangeRepository.findOne({
            where: { id },
            relations: ['user', 'userUpdate'],
        });
    }

    async changeStatus(id: number): Promise<string | Error> {
        console.log('cambiando status');
        const updateRange = await this.rates2RangeRepository.findOneBy({ id });
        updateRange.isActive = !updateRange.isActive;

        try {
            await this.rates2RangeRepository.save(updateRange);
            return '¡Rango editado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, updateRates2RangeDto: UpdateRates2RangeDto): Promise<Rates2Range> {
        const taxRateToUpdate = await this.rates2RangeRepository.findOne({ where: { id } });
        this.rates2RangeRepository.merge(taxRateToUpdate, updateRates2RangeDto);
        return await this.rates2RangeRepository.save(taxRateToUpdate);
    }

    remove(id: number) {
        return `This action removes a #${id} rates2Range`;
    }

    async knowWhatRangeIsApplied(paidAmount: number) {
        const rawQuery = `
      SELECT *
      FROM config_administrative_rates2_range
      WHERE ? >= CAST(minimumAmountPaid AS DECIMAL) 
        AND ? <= CAST(maximumAmountPaid AS DECIMAL)
      ORDER BY id DESC
      LIMIT 1
    `;

        const result = await this.rates2RangeRepository.query(rawQuery, [paidAmount, paidAmount]);

        if (result.length > 0) {
            return result[0];
        }

        return 0;
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.addRow(['Reporte de Tasas de Cambio']);
        worksheet.columns = [
            { header: 'Monto Mínimo Pagado:', key: 'minimumAmountPaid', width: 20 },
            { header: 'Monto Máximo Pagado:', key: 'maximumAmountPaid', width: 20 },
            { header: 'Porcentaje de Retención:', key: 'retentionPorcentage', width: 20 },
            { header: 'Sustraendo UT:', key: 'sustractingUT', width: 20 },
            { header: 'Sustraendo BS:', key: 'sustractingBs', width: 20 },
            { header: 'Fecha de Creación', key: 'createdAt', width: 25 },
            { header: 'Fecha De Actualización:', key: 'updatedAt', width: 20 },
            { header: 'Registrado por', key: 'userR', width: 20 },
            { header: 'Actualizado por', key: 'user', width: 20 },
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
                minimumAmountPaid: item.minimumAmountPaid,
                maximumAmountPaid: item.maximumAmountPaid,
                retentionPorcentage: item.retentionPorcentage,
                sustractingUT: item.sustractingUT,
                sustractingBs: item.sustractingBs,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                value: item.value,
                user: item.user.name,
                userR: item.user.name,
                userUpdate: item.userUpdate.name,
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
}
