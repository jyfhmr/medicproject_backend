import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuantitiesPackageDto } from './dto/create-quantities-package.dto';
import { UpdateQuantitiesPackageDto } from './dto/update-quantities-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuantitiesPackage } from './entities/quantities-package.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import * as XLSX from 'xlsx';

@Injectable()
export class QuantitiesPackageService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(QuantitiesPackage)
        private quantitiesPackageRepository: Repository<QuantitiesPackage>,
    ) {}

    async create(
        createQuantitiesPackageDto: CreateQuantitiesPackageDto,
        userId: number,
    ): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const quantity = await this.quantitiesPackageRepository.findOne({
            where: {
                name: createQuantitiesPackageDto.name,
            },
        });
        if (quantity) {
            throw new HttpException('La cantidad  ya se encuentra registrado', 401);
        }

        let maxId = await this.quantitiesPackageRepository
            .createQueryBuilder('inventory_products_quantities_concentration')
            .select('MAX(inventory_products_quantities_concentration.id)', 'max')
            .getRawOne();

        maxId = maxId.max ? parseInt(maxId.max) + 1 : 1;

        if (parseInt(maxId) < 10) {
            maxId = `00${maxId}`;
        } else if (parseInt(maxId) >= 10 && parseInt(maxId) <= 99) {
            maxId = `0${maxId}`;
        }

        const newTypePresentation = {
            ...createQuantitiesPackageDto,
            name: createQuantitiesPackageDto.name.toUpperCase(),
            code: maxId,
            user: user,
            userUpdate: user,
        };

        try {
            await this.quantitiesPackageRepository.save(newTypePresentation);
            return 'Units concentration created successfully';
        } catch (error) {
            console.log(error);

            throw new HttpException(
                'Error creating units quantities Package',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listQuantitiesPackage(): Promise<QuantitiesPackage[]> {
        return await this.quantitiesPackageRepository.find({
            where: { isActive: true },
        });
    }

    async findAll(query: any): Promise<{ totalRows: number; data: QuantitiesPackage[] }> {
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
            isActive: query.isActive != '' ? query.isActive : undefined,
            code: Like(`%${query.code || ''}%`),
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined,
        };
        try {
            const [resCount, resData] = await Promise.all([
                this.quantitiesPackageRepository.count({ relations, where }),
                query?.export
                    ? this.quantitiesPackageRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.quantitiesPackageRepository.find({
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
                'Error fetching quantities Package',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number): Promise<QuantitiesPackage> {
        const quantityPackage = await this.quantitiesPackageRepository.findOne({
            where: { id },
        });
        if (!quantityPackage) {
            throw new HttpException('quantities Package not found', HttpStatus.NOT_FOUND);
        }
        return quantityPackage;
    }

    async update(id: number, updateQuantitiesPackageDto: UpdateQuantitiesPackageDto) {
        const quantityPackage = await this.findOne(id);
        if (!quantityPackage) {
            throw new HttpException('Type of Presentation not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(quantityPackage, updateQuantitiesPackageDto);

        try {
            await this.quantitiesPackageRepository.save(quantityPackage);
            return `quantities Package #${id} updated successfully`;
        } catch (error) {
            throw new HttpException(
                'Error updating Units concentration',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} quantitiesPackage`;
    }

    async changeStatus(id: number): Promise<string | Error> {
        const quantityPackage = await this.quantitiesPackageRepository.findOneBy({ id });
        quantityPackage.isActive = !quantityPackage.isActive;

        try {
            await this.quantitiesPackageRepository.save(quantityPackage);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
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
            const createdAt =
                item.createdAt instanceof Date && !isNaN(item.createdAt.getTime())
                    ? item.createdAt.toISOString()
                    : 'Fecha no disponible';

            const updatedAt =
                item.updatedAt instanceof Date && !isNaN(item.updatedAt.getTime())
                    ? item.updatedAt.toISOString()
                    : 'Fecha no disponible';

            const rowData = {
                id: item.id,
                name: item.name,
                code: item.code,
                createAt: createdAt, // Asegurarte de que sea una fecha válida o mostrar un valor por defecto
                updateAt: updatedAt, // Asegurarte de que sea una fecha válida o mostrar un valor por defecto
                createdBy: item.user ? item.user.id : 'N/A',
                updatedBy: item.userUpdate ? item.userUpdate.id : 'N/A',
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
            return this.quantitiesPackageRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                code: data['code'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.quantitiesPackageRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}
