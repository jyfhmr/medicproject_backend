import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';
import { config_admistrative_reason } from './entities/reason.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/config/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Not, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReasonService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(config_admistrative_reason)
        private reasonRepository: Repository<config_admistrative_reason>,
    ) {}
    async create(
        createReasonDto: CreateReasonDto,
        userId: number,
    ): Promise<config_admistrative_reason> {
        const user = await this.usersService.findOne(userId);
        // Verificar si ya existe una entidad con el mismo nombre y código de banco

        const newReason = this.reasonRepository.create(createReasonDto);

        newReason.user = user;

        await this.reasonRepository.save(newReason);
        return;
    }

    async findAll(query: any): Promise<{ totalRows: number; data: config_admistrative_reason[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        console.log(query);

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
            NameReason: Like(`%${query.module || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
            id: query.dataMotiveId ? Not(In(query.dataMotiveId)) : undefined,
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.reasonRepository.count({ where }),
                query?.export
                    ? this.reasonRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.reasonRepository.find({
                          relations,
                          where,
                          order: { id: order },
                          take,
                          skip,
                      }),
            ]);
            console.log(resData);
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

    async findOne(id: number): Promise<config_admistrative_reason> {
        return await this.reasonRepository.findOne({ where: { id: id } });
    }

    async update(id: number, updateReasonDto: UpdateReasonDto, userId: number) {
        const user = await this.usersService.findOne(userId);
        // Actualiza el registro correspondiente
        await this.reasonRepository.update({ id: id }, updateReasonDto);

        console.log(updateReasonDto);
        // Recupera el registro actualizado
        const updatedupdatedPaymentMethod = await this.reasonRepository.findOne({
            where: { id: id },
        });
        // Establece el usuario que realizó la actualización
        if (updatedupdatedPaymentMethod) {
            updatedupdatedPaymentMethod.userUpdate = user;
            await this.reasonRepository.save(updatedupdatedPaymentMethod);
        }
        return 'This action updates Bank';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.reasonRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.reasonRepository.save(updateStatus);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.addRow(['Reporte de Datos']);
        worksheet.columns = [
            { header: 'Método:', key: 'method', width: 20 },
            { header: 'Tipo de método de pago:', key: 'typeMethodPayment', width: 20 },
            { header: 'Descrptcción:', key: 'description', width: 20 },
            { header: 'Code:', key: 'code', width: 20 },
        ];
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
