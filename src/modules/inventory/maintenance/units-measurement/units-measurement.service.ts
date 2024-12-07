import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUnitsMeasurementDto } from './dto/create-units-measurement.dto';
import { UpdateUnitsMeasurementDto } from './dto/update-units-measurement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitsMeasurement } from './entities/units-measurement.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import * as XLSX from 'xlsx';

@Injectable()
export class UnitsMeasurementService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(UnitsMeasurement)
        private unitsMeasurementRepository: Repository<UnitsMeasurement>,
    ) {}

    async create(
        createUnitsMeasurementDto: CreateUnitsMeasurementDto,
        userId: number,
    ): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const unitsConcentrationDto = await this.unitsMeasurementRepository.findOne({
            where: {
                name: createUnitsMeasurementDto.name,
            },
        });
        if (unitsConcentrationDto) {
            throw new HttpException('La unidad de concentracion ya se encuentra registrado', 401);
        }

        let maxId = await this.unitsMeasurementRepository
            .createQueryBuilder('inventory_products_units_measurement')
            .select('MAX(inventory_products_units_measurement.id)', 'max')
            .getRawOne();

        maxId = maxId.max ? parseInt(maxId.max) + 1 : 1;

        if (parseInt(maxId) < 10) {
            maxId = `0${maxId}`;
        }

        const newTypePresentation = {
            ...createUnitsMeasurementDto,
            name: createUnitsMeasurementDto.name.toUpperCase(),
            code: maxId,
            user: user,
            userUpdate: user,
        };

        try {
            await this.unitsMeasurementRepository.save(newTypePresentation);
            return 'Units measurement created successfully';
        } catch (error) {
            console.log(error);

            throw new HttpException(
                'Error creating units measurement',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listUnitsMeasurement(): Promise<UnitsMeasurement[]> {
        return await this.unitsMeasurementRepository.find({
            where: { isActive: true },
        });
    }

    async findAll(query: any): Promise<{ totalRows: number; data: UnitsMeasurement[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
        };

        let updateAt;

        if (query.updateAt) {
            const dates = query.updateAt.split(',');
            if (dates.length === 2) {
                updateAt = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        let createdAt;

        if (query.createdAt) {
            const dates = query.createdAt.split(',');
            if (dates.length === 2) {
                createdAt = Between(new Date(dates[0]), new Date(dates[1]));
            }
        }

        const where = {
            id: Raw((id) => `CAST(${id} as char) Like '%${query.id || ''}%'`),
            name: Like(`%${query.name || ''}%`),
            code: Like(`%${query.code || ''}%`),
            isActive: query.isActive != '' ? query.isActive : undefined,
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Add the date range filte
        };
        try {
            const [resCount, resData] = await Promise.all([
                this.unitsMeasurementRepository.count({ relations, where }),
                query?.export
                    ? this.unitsMeasurementRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.unitsMeasurementRepository.find({
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
            throw new HttpException(
                'Error fetching Units measurement',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number): Promise<UnitsMeasurement> {
        const unitsMeasurement = await this.unitsMeasurementRepository.findOne({
            where: { id },
        });
        if (!unitsMeasurement) {
            throw new HttpException('Units Measurement not found', HttpStatus.NOT_FOUND);
        }
        return unitsMeasurement;
    }

    async update(id: number, updateUnitsMeasurementDto: UpdateUnitsMeasurementDto) {
        const unitsMeasurement = await this.findOne(id);
        if (!unitsMeasurement) {
            throw new HttpException('Type of Measurement not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(unitsMeasurement, updateUnitsMeasurementDto);

        try {
            await this.unitsMeasurementRepository.save(unitsMeasurement);
            return `Units Measurement #${id} updated successfully`;
        } catch (error) {
            throw new HttpException(
                'Error updating Units Measurement',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} unitsMeasurement`;
    }

    async changeStatus(id: number): Promise<string | Error> {
        const unitsMeasurement = await this.unitsMeasurementRepository.findOneBy({ id });
        unitsMeasurement.isActive = !unitsMeasurement.isActive;

        try {
            await this.unitsMeasurementRepository.save(unitsMeasurement);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async getAllBanks(): Promise<UnitsMeasurement[]> {
        return this.unitsMeasurementRepository.find();
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = [
            { header: 'name', key: 'name', width: 20 },
            { header: 'code', key: 'code', width: 20 },
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
                code: item.code,
                createAt: item.createdAt.toISOString(), // Convertir a string en formato ISO
                updateAt: item.updatedAt.toISOString(), // Convertir a string en formato ISO
                createdBy: item.user ? item.user.id : 'N/A', // Si user es null, poner 'N/A'
                updatedBy: item.userUpdate ? item.userUpdate.id : 'N/A', // Si userUpdate es null, poner 'N/A'
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
            return this.unitsMeasurementRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                code: data['code'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.unitsMeasurementRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}
