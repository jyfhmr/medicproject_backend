import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatesOrPorcentageDto } from './dto/create-rates_or_porcentage.dto';
import { UpdateRatesOrPorcentageDto } from './dto/update-rates_or_porcentage.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { RatesOrPorcentage } from './entities/rates_or_porcentage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class RatesOrPorcentageService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(RatesOrPorcentage)
        private ratesOrPorcentageServiceRepository: Repository<RatesOrPorcentage>,
    ) {}
    async create(
        createRatesOrPorcentageDto: CreateRatesOrPorcentageDto,
        userId: number,
    ): Promise<RatesOrPorcentage> {
        const user = await this.usersService.findOne(userId);
        // Verificar si ya existe una entidad con el mismo nombre y código de banco

        const newAccount = this.ratesOrPorcentageServiceRepository.create(
            createRatesOrPorcentageDto,
        );

        newAccount.user = user;
        console.log(newAccount);
        return await this.ratesOrPorcentageServiceRepository.save(newAccount);
    }

    async findAll(query: any): Promise<{ totalRows: number; data: RatesOrPorcentage[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
        };

        let dateRange: any;

        if (query.updateAt) {
            const dates = query.updateAt.split(',');
            if (dates.length === 2) {
                dateRange = Between(new Date(dates[0]), new Date(dates[1]));
            }
        } else if (query.createAt) {
            const dates = query.createAt.split(',');
            if (dates.length === 2) {
                dateRange = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        const where = {
            id: Raw((id) => `CAST(${id} as char) Like '%${query.id || ''}%'`),
            value: Like(`%${query.value || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.ratesOrPorcentageServiceRepository.count({ where }),
                query?.export
                    ? this.ratesOrPorcentageServiceRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.ratesOrPorcentageServiceRepository.find({
                          relations,
                          where,
                          order: { id: order },
                          take,
                          skip,
                      }),
            ]);
            return {
                totalRows: resCount,
                data: resData,
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error fetching sub categories',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number): Promise<RatesOrPorcentage> {
        return await this.ratesOrPorcentageServiceRepository.findOne({ where: { id: id } });
    }

    async update(
        id: number,
        updateRatesOrPorcentageDto: UpdateRatesOrPorcentageDto,
        userId: number,
    ) {
        const user = await this.usersService.findOne(userId);
        // Actualiza el registro correspondiente
        await this.ratesOrPorcentageServiceRepository.update(
            { id: id },
            updateRatesOrPorcentageDto,
        );

        // Recupera el registro actualizado
        const updatedAccount = await this.ratesOrPorcentageServiceRepository.findOne({
            where: { id: id },
        });

        // Establece el usuario que realizó la actualización
        if (updatedAccount) {
            updatedAccount.userUpdate = user;
            await this.ratesOrPorcentageServiceRepository.save(updatedAccount);
        }
        return 'This action updates Bank';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.ratesOrPorcentageServiceRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.ratesOrPorcentageServiceRepository.save(updateStatus);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.addRow(['Reporte de Datos']);
        worksheet.columns = [{ header: 'Nombre de cuenta:', key: 'value', width: 20 }];
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2a953d' },
        };
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };

        // Agregar datos y aplicar estilos
        data.forEach((item) => {
            const row = worksheet.addRow(item);

            row.alignment = { vertical: 'middle', horizontal: 'left' };
            row.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename=data.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
