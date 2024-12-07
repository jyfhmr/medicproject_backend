import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import { Catalogue } from '../../catalogue/entities/catalogue.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class BrandsService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Brand) private brandsRepository: Repository<Brand>,
        @InjectRepository(Catalogue) private catalogueRepository: Repository<Catalogue>,
    ) {}

    async create(createBrandDto: CreateBrandDto, userId: number): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const brand = await this.brandsRepository.findOne({
            where: {
                name: createBrandDto.name,
            },
        });
        if (brand) {
            throw new HttpException('La marca  ya se encuentra registrado', 401);
        }

        let maxId = await this.brandsRepository
            .createQueryBuilder('inventory_products_brands')
            .select('MAX(inventory_products_brands.id)', 'max')
            .getRawOne();

        maxId = maxId.max ? parseInt(maxId.max) + 1 : 1;

        if (parseInt(maxId) < 10) {
            maxId = `00${maxId}`;
        } else if (parseInt(maxId) >= 10 && parseInt(maxId) <= 99) {
            maxId = `0${maxId}`;
        }

        const newBrand = {
            ...createBrandDto,
            name: createBrandDto.name.toUpperCase(),
            code: maxId,
            user: user,
            userUpdate: user,
        };

        try {
            
            if(process.env.URL_SUPER_ADMIN){
                const response = await fetch(process.env.URL_SUPER_ADMIN + '/sync/brand', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${process.env.TOKEN_SUPER_ADMIN}`, // Añades el token Bearer en el header
                    },
                    body: JSON.stringify(newBrand),
                    
                });
              
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(response)
            }
           
            await this.brandsRepository.save(newBrand);

  ;
            return 'Brand created successfully';
        } catch (error) {
            console.log(error);
            throw new HttpException('Error creating Brand', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async listBrands(): Promise<Brand[]> {
        return await this.brandsRepository.find({ where: { isActive: true } });
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Brand[] }> {
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
            updateAt: updateAt || undefined, // Add the date range filter if it exists
        };
        try {
            const [resCount, resData] = await Promise.all([
                this.brandsRepository.count({ relations, where }),
                query?.export
                    ? this.brandsRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.brandsRepository.find({
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
            throw new HttpException('Error fetching brands', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Brand> {
        const brand = await this.brandsRepository.findOne({ where: { id } });
        if (!brand) {
            throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
        }
        return brand;
    }

    async update(id: number, updateBrandDto: UpdateBrandDto) {
        const brand = await this.findOne(id);
        if (!brand) {
            throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
        }

        const oldBrandName = brand.name;
        const newBrandName = updateBrandDto.name;

        console.log(oldBrandName, newBrandName);

        Object.assign(brand, updateBrandDto);

        try {
            // Actualizar la marca en la tabla de marcas
            await this.brandsRepository.save(brand);

            // Realizar el REPLACE en la tabla inventory_products_catalogue

            let barndN = {
                ...brand,
                nameOld: oldBrandName, // Añadir la propiedad code_old
            };

            const response = await fetch(process.env.URL_SUPER_ADMIN + '/sync/brand', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.TOKEN_SUPER_ADMIN}`, // Añades el token Bearer en el header
                },
                body: JSON.stringify(barndN),
            });

            await this.catalogueRepository
                .createQueryBuilder()
                .update('inventory_products_catalogue')
                .set({
                    description: () => `REPLACE(description, :oldBrandName, :newBrandName)`,
                })
                .where('brandId = :id', { id })
                .setParameters({ oldBrandName, newBrandName })
                .execute();

            console.log(response);

            return `Brand #${id} updated successfully and descriptions updated in inventory_products_catalogue`;
        } catch (error) {
            console.log(error);
            throw new HttpException('Error updating brand', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        const brand = await this.findOne(id);
        if (!brand) {
            throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
        }

        try {
            await this.brandsRepository.remove(brand);
            return `Brand #${id} removed successfully`;
        } catch (error) {
            throw new HttpException('Error removing brand', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateBrand = await this.brandsRepository.findOneBy({ id });
        updateBrand.isActive = !updateBrand.isActive;

        try {
            await this.brandsRepository.save(updateBrand);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async getAllBanks(): Promise<Brand[]> {
        return this.brandsRepository.find();
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
            return this.brandsRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                name: data['name'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                code: data['code'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.brandsRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }
}
