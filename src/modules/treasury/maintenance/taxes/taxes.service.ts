import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasury_maintenance_Tax } from './entities/tax.entity';
import { Repository, Like, Raw, Between } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import { Treasury_maintenance_type_tax } from './entities/typeTax.entity';

@Injectable()
export class TaxesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Treasury_maintenance_Tax)
        private taxRepository: Repository<Treasury_maintenance_Tax>,
        @InjectRepository(Treasury_maintenance_type_tax)
        private typeTaxRepository: Repository<Treasury_maintenance_type_tax>,
    ) {}

    async create(createTaxDto: CreateTaxDto, userId: number) {
        const { name } = createTaxDto;

        const existingMoney = await this.taxRepository.findOne({ where: { name } });

        const user = await this.usersService.findOne(userId);

        if (existingMoney) {
            throw new ConflictException('La moneda ya existe.');
        }

        const newMoney = this.taxRepository.create(createTaxDto);
        newMoney.user = user;
        this.taxRepository.save(newMoney);
        return 'This action adds a new taxes';
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Treasury_maintenance_Tax[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            applicableCurrency: true,
            typeTax: true,
        };

        let dateRange: any;

        if (query.updatedAt) {
            const dates = query.updatedAt.split(',');
            if (dates.length === 2) {
                dateRange = Between(new Date(dates[0]), new Date(dates[1]));
            }
        } else if (query.createdAt) {
            const dates = query.createdAt.split(',');
            if (dates.length === 2) {
                dateRange = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        const where = {
            id: Raw((id) => `CAST(${id} as char) Like '%${query.id || ''}%'`),
            name: Like(`%${query.name || ''}%`),
            updatedAt: dateRange || undefined, // Add the date range filter if it exists
            createdAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check

            // Filtros para entidades relacionadas
            user: query.user ? { id: query.user } : undefined, // Filtro para la relación con 'user'
            userUpdate: query.userUpdate ? { id: query.userUpdate } : undefined, // Filtro para la relación con 'userUpdate'
            applicableCurrency: query.applicableCurrency
                ? { id: query.applicableCurrency }
                : undefined, // Filtro para la relación con 'applicableCurrency'
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.taxRepository.count({ where }),
                query?.export
                    ? this.taxRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.taxRepository.find({
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
    async findAllTypeTax(
        query: any,
    ): Promise<{ totalRows: number; data: Treasury_maintenance_type_tax[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        try {
            const [resCount, resData] = await Promise.all([
                this.typeTaxRepository.count(),
                query?.export
                    ? this.typeTaxRepository.find({
                          order: { id: order },
                      })
                    : this.typeTaxRepository.find({
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

    async findOne(id: number): Promise<Treasury_maintenance_Tax> {
        const relations = {
            user: true,
            userUpdate: true,
            applicableCurrency: true,
            typeTax: true,
        };

        return await this.taxRepository.findOne({
            where: { id },
            relations,
        });
    }

    async searchByTypeTax(typeTax: number): Promise<Treasury_maintenance_type_tax> {
        return await this.typeTaxRepository.findOne({
            where: { isActive: true },
        });
    }

    async update(id: number, updateTaxDto: UpdateTaxDto, userId: number) {
        const user = await this.usersService.findOne(userId);

        // Actualiza el registro correspondiente
        await this.taxRepository.update({ id: id }, updateTaxDto);

        // Recupera el registro actualizado
        const updatedMoney = await this.taxRepository.findOne({ where: { id: id } });

        // Establece el usuario que realizó la actualización
        if (updatedMoney) {
            updatedMoney.userUpdate = user;
            await this.taxRepository.save(updatedMoney);
        }

        return 'This action updates taxes';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.taxRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.taxRepository.save(updateStatus);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (err) {
            throw err;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = [
            { header: 'name', key: 'name', width: 20 },
            { header: 'value', key: 'value', width: 20 },
            { header: 'user', key: 'createdBy', width: 25 }, // Columna para usuario creador
            { header: 'userUpdate', key: 'updatedBy', width: 25 }, // Columna para usuario que actualizó
            { header: 'createAt', key: 'createAt', width: 20 },
            { header: 'updateAt', key: 'updateAt', width: 20 },
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
            // Extraer y aplanar datos relevantes
            const rowData = {
                name: item.name,
                value: item.value,
                createAt: item.createAt.toISOString(), // Convertir a string en formato ISO
                updateAt: item.updateAt.toISOString(), // Convertir a string en formato ISO
                createdBy: item.user ? item.user.id : 'N/A', // Si user es null, poner 'N/A'
                updatedBy: item.userUpdate ? item.userUpdate.id : 'N/A', // Si userUpdate es null, poner 'N/A'
                updatedByEmail: item.userUpdate ? item.userUpdate.email : 'N/A', // Email del userUpdate
            };

            const row = worksheet.addRow(rowData);

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

    async processExcel(buffer: Buffer): Promise<any> {
        // Leer el archivo Excel desde el buffer
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja de trabajo
        const worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja de Excel en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validar y mapear los datos a tu entidad
        const entities = jsonData.map((data: any) => {
            return this.taxRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.taxRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}
