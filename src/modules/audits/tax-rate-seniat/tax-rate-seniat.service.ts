import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaxRateSeniatDto } from './dto/create-tax-rate-seniat.dto';
import { UpdateTaxRateSeniatDto } from './dto/update-tax-rate-seniat.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { TaxRateSeniat } from './entities/tax-rate-seniat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class TaxRateSeniatService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(TaxRateSeniat) private taxRateSeniatRepository: Repository<TaxRateSeniat>,
    ) {}

    async create(createTaxRateSeniatDto: CreateTaxRateSeniatDto, userId: number) {
        const user = await this.usersService.findOne(userId);

        const newTaxRateSeniat = this.taxRateSeniatRepository.create(createTaxRateSeniatDto);
        newTaxRateSeniat.user = user;
        newTaxRateSeniat.userUpdate = user;

        await this.taxRateSeniatRepository.save(newTaxRateSeniat);
        return;
    }

    async findAll(query: any): Promise<{ totalRows: number; data: TaxRateSeniat[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const where = this.buildWhereClause(query);

        try {
            const [resCount, resData] = await Promise.all([
                this.taxRateSeniatRepository.count({ where }),
                query?.export
                    ? this.taxRateSeniatRepository.find({
                          where,
                          order: { id: order },
                          relations: ['user', 'userUpdate'],
                      })
                    : this.taxRateSeniatRepository.find({
                          where,
                          order: { id: order },
                          take,
                          skip,
                          relations: ['user', 'userUpdate'],
                      }),
            ]);

            console.log('data', resData);

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

        // Filtro por valor
        if (query.value) {
            where.value = Raw((alias) => `${alias} LIKE '%${query.value}%'`);
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

    async findOne(id: number): Promise<TaxRateSeniat> {
        return await this.taxRateSeniatRepository.findOne({
            where: { id },
            relations: ['user', 'userUpdate'],
        });
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateTaxRate = await this.taxRateSeniatRepository.findOneBy({ id });
        updateTaxRate.isActive = !updateTaxRate.isActive;

        try {
            await this.taxRateSeniatRepository.save(updateTaxRate);
            return '¡Cambio de tasa de unidad tributaria con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async update(
        id: number,
        updateTaxRateSeniatDto: UpdateTaxRateSeniatDto,
    ): Promise<TaxRateSeniat> {
        const taxRateToUpdate = await this.taxRateSeniatRepository.findOne({ where: { id } });
        this.taxRateSeniatRepository.merge(taxRateToUpdate, updateTaxRateSeniatDto);
        return await this.taxRateSeniatRepository.save(taxRateToUpdate);
    }

    async findActive(): Promise<TaxRateSeniat> {
        const activeRate = await this.taxRateSeniatRepository.findOne({
            where: { isActive: true },
            relations: ['user', 'userUpdate'],
        });

        if (!activeRate) {
            throw new HttpException('No active tax rate found', HttpStatus.NOT_FOUND);
        }

        return activeRate;
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.addRow(['Reporte de Tasas de Cambio']);
        worksheet.columns = [
            { header: 'Fecha de Creación', key: 'createdAt', width: 25 },
            { header: 'Fecha De Actualización:', key: 'updatedAt', width: 20 },
            { header: 'Valor:', key: 'value', width: 20 },
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
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                value: item.value,
                user: item.user.name,
                userR: item.user.name,
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
