import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConcentrationDto } from './dto/create-concentration.dto';
import { UpdateConcentrationDto } from './dto/update-concentration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitsConcentrationService } from '../units-concentration/units-concentration.service';
import { Concentration } from './entities/concentration.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ConcentrationService {
    constructor(
        private usersService: UsersService,
        private unitsConcentrationService: UnitsConcentrationService,
        @InjectRepository(Concentration)
        private concentrationRepository: Repository<Concentration>,
    ) {}

    async create(createConcentrationDto: CreateConcentrationDto, userId: number): Promise<string> {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const contration = await this.concentrationRepository.findOne({
            where: {
                name: createConcentrationDto.name,
            },
        });
        if (contration) {
            throw new HttpException('La concentración  ya se encuentra registrado', 401);
        }

        let maxId = await this.concentrationRepository
            .createQueryBuilder('inventory_products_concentration')
            .select('MAX(inventory_products_concentration.id)', 'max')
            .getRawOne();

        maxId = maxId.max ? parseInt(maxId.max) + 1 : 1;

        if (parseInt(maxId) < 10) {
            maxId = `00${maxId}`;
        } else if (parseInt(maxId) >= 10 && parseInt(maxId) <= 99) {
            maxId = `0${maxId}`;
        }

        const newConcentration = this.concentrationRepository.create({
            ...createConcentrationDto,
            name: createConcentrationDto.name,
            //unitsConcentration: createConcentrationDto.unitsConcentration,
            // description:
            //     createConcentrationDto.name ,
            code: maxId,
            user: user,
            userUpdate: user,
        });

        try {
            await this.concentrationRepository.save(newConcentration);
            return 'Concentration created successfully';
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error creating concentration',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listConcentration(): Promise<Concentration[]> {
        return await this.concentrationRepository.find({
            where: { isActive: true },
            // relations: {
            //     unitsConcentration: true,
            // },
        });
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Concentration[] }> {
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
            isActive: query.isActive !== undefined ? query.isActive : undefined,
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Add the date range filter if it exists
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.concentrationRepository.count({ relations, where }),
                query?.export
                    ? this.concentrationRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.concentrationRepository.find({
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
                'Error fetching  concentration',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number): Promise<Concentration> {
        const concentration = await this.concentrationRepository.findOne({
            where: { id },
            // relations: {
            //     unitsConcentration: true,
            // },
        });

        if (!concentration) {
            throw new HttpException('Concentration not found', HttpStatus.NOT_FOUND);
        }

        return concentration;
    }

    async update(id: number, updateConcentrationDto: UpdateConcentrationDto) {
        const concentration = await this.findOne(id);

        if (!concentration) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(concentration, updateConcentrationDto);
        //concentration.description = concentration.name + concentration.unitsConcentration.name;

        try {
            await this.concentrationRepository.save(concentration);
            return `Sub Category #${id} updated successfully`;
        } catch (error) {
            throw new HttpException(
                'Error updating sub category',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} concentration`;
    }

    async changeStatus(id: number): Promise<string> {
        const concentrartion = await this.findOne(id);
        if (!concentrartion) {
            throw new HttpException('Concentration not found', HttpStatus.NOT_FOUND);
        }

        concentrartion.isActive = !concentrartion.isActive;

        try {
            await this.concentrationRepository.save(concentrartion);
            return 'Concentration status changed successfully';
        } catch (error) {
            throw new HttpException(
                'Error changing category status',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
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
            return this.concentrationRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                code: data['code'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.concentrationRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}
