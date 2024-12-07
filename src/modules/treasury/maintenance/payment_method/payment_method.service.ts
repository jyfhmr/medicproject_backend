import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { Treasury_maintenance_PaymentMethod } from './entities/payment_method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class PaymentMethodService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Treasury_maintenance_PaymentMethod)
        private paymentMethodRepository: Repository<Treasury_maintenance_PaymentMethod>,
    ) {}
    async create(
        createPaymentMethodDto: CreatePaymentMethodDto,
        userId: number,
    ): Promise<Treasury_maintenance_PaymentMethod> {
        const user = await this.usersService.findOne(userId);
        // Verificar si ya existe una entidad con el mismo nombre y código de banco

        const newPaymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);

        newPaymentMethod.user = user;

        await this.paymentMethodRepository.save(newPaymentMethod);
        return;
    }

    async findAll(
        query: any,
    ): Promise<{ totalRows: number; data: Treasury_maintenance_PaymentMethod[] }> {
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
            method: Like(`%${query.method || ''}%`),
            typeMethodPayment: Like(`%${query.typeMethodPayment || ''}%`),
            description: Like(`%${query.description || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.paymentMethodRepository.count({ where }),
                query?.export
                    ? this.paymentMethodRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.paymentMethodRepository.find({
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

    async findOne(id: number): Promise<Treasury_maintenance_PaymentMethod> {
        return await this.paymentMethodRepository.findOne({ where: { id: id } });
    }

  

    async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto, userId: number) {
        console.log(updatePaymentMethodDto);
        const user = await this.usersService.findOne(userId);
        // Actualiza el registro correspondiente
        await this.paymentMethodRepository.update({ id: id }, updatePaymentMethodDto);

        console.log(updatePaymentMethodDto);
        // Recupera el registro actualizado
        const updatedupdatedPaymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: id },
        });
        // Establece el usuario que realizó la actualización
        if (updatedupdatedPaymentMethod) {
            updatedupdatedPaymentMethod.userUpdate = user;
            await this.paymentMethodRepository.save(updatedupdatedPaymentMethod);
        }
        return 'This action updates Bank';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.paymentMethodRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.paymentMethodRepository.save(updateStatus);
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
