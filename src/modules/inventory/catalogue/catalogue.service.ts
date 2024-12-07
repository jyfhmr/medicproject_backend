import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { SubCategoriesService } from '../maintenance/sub-categories/sub-categories.service';
import { Catalogue } from './entities/catalogue.entity';
import { Between, DataSource, In, Like, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as XLSX from 'xlsx';

@Injectable()
export class CatalogueService {
    constructor(
        private usersService: UsersService,
        private subCategoriesService: SubCategoriesService,
        @InjectRepository(Catalogue)
        private catalogueRepository: Repository<Catalogue>,
        private dataSource: DataSource,
    ) {}

    async create(
        createCatalogueDto: CreateCatalogueDto,
        userId: number,
        filename: string | null,
    ): Promise<string> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const barcode = await this.catalogueRepository.findOneBy({
            barcode: createCatalogueDto.barcode,
        });

        if (barcode) {
            throw new HttpException(
                'Ya existe un articulo con el mismo codigo de barras',
                HttpStatus.AMBIGUOUS,
            );
        }

        const codeNew = createCatalogueDto.code;
        const queryBuilder = this.catalogueRepository
            .createQueryBuilder('inventory_products_catalogue')
            .select('COUNT(*)', 'cant')
            .where('SUBSTRING(inventory_products_catalogue.code, 1, 22) = :code', {
                code: codeNew.substring(0, 22),
            });

        const result = await queryBuilder.getRawOne();
        let count = result.cant;

        if (count < 10) {
            count = `0${count}`;
        }

        const description = await this.capitalizeWords(createCatalogueDto.description);

        const newCatalogue = this.catalogueRepository.create({
            ...createCatalogueDto,
            name:
                createCatalogueDto.name.charAt(0).toUpperCase() +
                createCatalogueDto.name.slice(1).toLowerCase(),
            activeIngredient:
                createCatalogueDto.activeIngredient.charAt(0).toUpperCase() +
                createCatalogueDto.activeIngredient.slice(1).toLowerCase(),
            subCategory: JSON.parse(createCatalogueDto.subCategory),
            brand: JSON.parse(createCatalogueDto.brand),
            typesPresentation: JSON.parse(createCatalogueDto.typesPresentation),
            unitMeasurement: JSON.parse(createCatalogueDto.unitMeasurement),
            unitConcentration: JSON.parse(createCatalogueDto.unitConcentration),
            typesPackaging: JSON.parse(createCatalogueDto.typesPackaging),
            quantityPackage: JSON.parse(createCatalogueDto.quantityPackage),
            code: createCatalogueDto.code + count,
            description: description,
            pharmaceuticalDescription: createCatalogueDto.pharmaceuticalDescription,
            concentration: JSON.parse(createCatalogueDto.concentration),
            user: user,
            userUpdate: user,
            img: filename,
        });

        console.log(newCatalogue);

        try {
            await queryRunner.manager.save(newCatalogue);

            if (process.env.URL_SUPER_ADMIN) {
                const response = await fetch(process.env.URL_SUPER_ADMIN + '/sync/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${process.env.TOKEN_SUPER_ADMIN}`, // Añades el token Bearer en el header
                    },
                    body: JSON.stringify(newCatalogue),
                });

                console.log(await response.json());

                // Validamos si la respuesta es correcta
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            await queryRunner.commitTransaction();

            // // Parseamos la respuesta a JSON
            // const responseData = await response.json();
            return 'Product add catalogue successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.log(error);
                throw new HttpException(
                    'Error interno del servidor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Catalogue[] }> {
        const take = query.rows || 100;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            subCategory: {
                category: true,
            },
            brand: true,
            concentration: true,
            typesPresentation: true,
            unitConcentration: true,
            typesPackaging: true,
            unitMeasurement: true,
            quantityPackage: true,
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

        const where: any = {
            name: Like(`%${query.name || ''}%`),
            code: Like(`%${query.code || ''}%`),
            barcode: Like(`%${query.barcode || ''}%`),

            // Concatenación de barcode y description utilizando Raw
            ...(query.search
                ? {
                      // Usa Raw para realizar la concatenación y la búsqueda
                      barcode: Raw(
                          () => `CONCAT(barcode, ' ', description) LIKE '%${query.search}%'`,
                      ),
                  }
                : {}),

            subCategory:
                query.subCategory || query.category
                    ? {
                          name: query.subCategory
                              ? Like(`%${query.subCategory || ''}%`)
                              : undefined,
                          category: query.category
                              ? {
                                    name: Like(`%${query.category || ''}%`),
                                }
                              : undefined,
                      }
                    : undefined,

            user: query.user ? { id: query.user } : undefined, // Filtro para la relación con 'user'
            userUpdate: query.userUpdate ? { id: query.userUpdate } : undefined, // Filtro para la relación con 'userUpdate'
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Agregar el filtro de rango de fechas si existe
            isActive: query.isActive ? query.isActive : true,
            id: query.productsId ? Not(In(query.productsId)) : undefined,
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.catalogueRepository.count({ relations, where }),
                query?.export
                    ? this.catalogueRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.catalogueRepository.find({
                          relations,
                          where,
                          order: { id: order },
                          take,
                          skip,
                      }),
            ]);

            const data = resData.map((el) => {
                return {
                    ...el,
                    category: el.subCategory.category.name,
                };
            });

            return {
                totalRows: resCount,
                data: data,
            };
        } catch (error) {
            console.log(error);
            throw new HttpException('Error fetching catalogue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Catalogue> {
        const subCategory = await this.catalogueRepository.findOne({
            where: { id },
            relations: {
                subCategory: {
                    category: true,
                },
                brand: true,
                concentration: true,
                typesPresentation: true,
                unitConcentration: true,
                typesPackaging: true,
                unitMeasurement: true,
                quantityPackage: true,
            },
        });

        console.log(subCategory);

        if (!subCategory) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        return subCategory;
    }

    async update(
        id: number,
        updateCatalogueDto: UpdateCatalogueDto,
        userId: number,
        filename: string | null,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await this.usersService.findOne(userId);
        const productCatalogue = await this.findOne(id);
        const oldImage = productCatalogue.img;

        // Asignar el valor del antiguo código a la nueva propiedad code_old
        const codeOld = productCatalogue.code;

        if (!productCatalogue) {
            throw new HttpException('Catalogue not found', HttpStatus.NOT_FOUND);
        }

        const newCode = updateCatalogueDto.code;
        const queryBuilderRegister = this.catalogueRepository
            .createQueryBuilder('inventory_products_catalogue')
            .where(
                'inventory_products_catalogue.id = :id and SUBSTRING(inventory_products_catalogue.code, 1, 22) = :code',
                {
                    id: id,
                    code: newCode.substring(0, 22),
                },
            );

        Object.assign(productCatalogue, updateCatalogueDto);

        //valida si ya ese codigo de barras esta en uso
        const productsWithSameCode = await this.catalogueRepository.find({
            where: {
                barcode: updateCatalogueDto.barcode,
                isActive: true,
            },
        });

        for (const product of productsWithSameCode) {
            console.log(product);
            if (product.id !== id) {
                throw new HttpException(
                    'El código de barras ya está en uso por otro artículo.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const resultRegister = await queryBuilderRegister.getRawOne();
        if (!resultRegister) {
            const queryBuilder = this.catalogueRepository
                .createQueryBuilder('inventory_products_catalogue')
                .select('COUNT(*)', 'cant')
                .where(
                    'inventory_products_catalogue.id <> :id and SUBSTRING(inventory_products_catalogue.code, 1, 22) = :code',
                    {
                        id: id,
                        code: newCode.substring(0, 22),
                    },
                );
            // const sqlQuery = queryBuilder.getSql();
            // console.log('Generated SQL Query:', sqlQuery);

            const result = await queryBuilder.getRawOne();
            let count = result.cant;

            if (count < 10) {
                count = `0${count}`;
            }
            productCatalogue.code = newCode.substring(0, 22) + count;
        }

        const description = await this.capitalizeWords(productCatalogue.description);

        productCatalogue.name =
            productCatalogue.name.charAt(0).toUpperCase() +
            productCatalogue.name.slice(1).toLowerCase();
        productCatalogue.subCategory = JSON.parse(updateCatalogueDto.subCategory);
        productCatalogue.brand = JSON.parse(updateCatalogueDto.brand);
        productCatalogue.typesPresentation = JSON.parse(updateCatalogueDto.typesPresentation);
        productCatalogue.unitMeasurement = JSON.parse(updateCatalogueDto.unitMeasurement);
        productCatalogue.unitConcentration = JSON.parse(updateCatalogueDto.unitConcentration);
        productCatalogue.typesPackaging = JSON.parse(updateCatalogueDto.typesPackaging);
        productCatalogue.quantityPackage = JSON.parse(updateCatalogueDto.quantityPackage);
        productCatalogue.description = description;
        productCatalogue.pharmaceuticalDescription = productCatalogue.pharmaceuticalDescription;
        productCatalogue.concentration = JSON.parse(updateCatalogueDto.concentration);
        productCatalogue.userUpdate = user;
        productCatalogue.img = filename;

        try {
            const imagePath = `./uploads/inventory/catalogue/img/${oldImage}`;
            if (oldImage && fs.existsSync(imagePath)) {
                oldImage && fs.unlinkSync(`./uploads/inventory/catalogue/img/${oldImage}`);
            }

            await queryRunner.manager.save(productCatalogue);

            // Crear una copia del objeto productCatalogue añadiendo la propiedad code_old
            const productCatalogueN = {
                ...productCatalogue,
                codeOld: codeOld, // Añadir la propiedad code_old
            };

            const response = await fetch(process.env.URL_SUPER_ADMIN + '/sync/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.TOKEN_SUPER_ADMIN}`, // Añades el token Bearer en el header
                },
                body: JSON.stringify(productCatalogueN),
            });

            console.log(response);

            // Validamos si la respuesta es correcta
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await queryRunner.commitTransaction();

            return `Product #${id} updated successfully`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error interno del servidor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    remove(id: number) {
        return `This action removes a #${id} catalogue`;
    }

    async changeStatus(id: number): Promise<string> {
        const productCatalogue = await this.findOne(id);
        if (!productCatalogue) {
            throw new HttpException('Sub Category not found', HttpStatus.NOT_FOUND);
        }

        productCatalogue.isActive = !productCatalogue.isActive;

        try {
            await this.catalogueRepository.save(productCatalogue);
            return 'Sub Category status changed successfully';
        } catch (error) {
            throw new HttpException(
                'Error changing category status',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update_code(): Promise<Catalogue[]> {
        try {
            const catalogue = await this.catalogueRepository.find({
                where: {
                    isActive: true,
                },
                relations: {
                    subCategory: {
                        category: true,
                    },
                    brand: true,
                    concentration: true,
                    typesPresentation: true,
                    unitConcentration: true,
                    typesPackaging: true,
                    unitMeasurement: true,
                    quantityPackage: true,
                    user: true,
                    userUpdate: true,
                },
            });
            let count: any;
            for (const el of catalogue) {
                // Cambiamos a 'for...of'
                const category = await this.dataSource.query(
                    `SELECT * FROM inventory_products_categories2 WHERE name = ? LIMIT 1`,
                    [el.subCategory.category.name],
                );

                const subcategory = await this.dataSource.query(
                    `SELECT * FROM inventory_products_sub_category2 WHERE name = ? LIMIT 1`,
                    [el.subCategory.name],
                );

                if (!subcategory[0] || !subcategory[0].code) {
                    console.log(category, subcategory, el.subCategory.name);
                }

                if (!category[0] || !category[0].code) {
                    console.log(category, category, el.subCategory.name);
                }

                let newCode =
                    el.brand.code +
                    category[0]?.code +
                    subcategory[0]?.code +
                    (el.typesPresentation?.code ?? '47') +
                    (el.concentration?.code ?? '102') +
                    (el.unitConcentration?.code ?? '14') +
                    el.typesPackaging.code +
                    el.quantityPackage.code +
                    el.unitMeasurement.code;

                const queryBuilder = await this.dataSource.query(
                    'SELECT COUNT(*) AS cant from inventory_products_catalogue2 where SUBSTRING(code, 1, 22) = ? ',
                    [newCode],
                );

                count = parseInt(queryBuilder[0].cant);
                if (count < 10) {
                    count = `0${count}`;
                }

                newCode = newCode + count;
                console.log('Nuevo código generado: ', newCode);

                const newDescription = await this.capitalizeWords(
                    `${el.name}, ${el.brand.name}, ${subcategory[0]?.name}, ${el.typesPresentation?.name ?? ' '}, ${el.concentration?.name ?? ''} ${
                        el.unitConcentration?.name ?? ''
                    }, ${el.typesPackaging.name}, ${el.quantityPackage.name} ${el.unitMeasurement.name}`,
                );

                await this.dataSource
                    .createQueryBuilder()
                    .insert()
                    .into('inventory_products_catalogue2')
                    .values({
                        name: el.name.charAt(0).toUpperCase() + el.name.slice(1).toLowerCase(),
                        description: newDescription,
                        activeIngredient:
                            el.activeIngredient.charAt(0).toUpperCase() +
                            el.activeIngredient.slice(1).toLowerCase(),
                        barcode: el.barcode.length === 24 ? newCode : el.barcode,
                        pharmaceuticalDescription: el.pharmaceuticalDescription,
                        code: newCode,
                        isActive: true,
                        createdAt: el.createdAt,
                        updatedAt: el.updatedAt,
                        img: null,
                        subcategoryId: subcategory[0].id,
                        brandId: el.brand.id,
                        typesPresentationId: el.typesPresentation?.id ?? 47,
                        concentrationId: el.concentration?.id ?? 102,
                        unitConcentrationId: el.unitConcentration?.id ?? 14,
                        typesPackagingId: el.typesPackaging.id,
                        unitMeasurementId: el.unitMeasurement.id,
                        quantityPackageId: el.quantityPackage.id,
                        userId: el.user.id,
                        userUpdateId: el.userUpdate.id,
                    })
                    .execute();
            }

            return catalogue;
        } catch (error) {
            console.log('Error en el producto:', error);
            throw error; // Recomendado lanzar el error para que sea manejado externamente
        }
    }

    async capitalizeWords(str) {
        return str
            .split(',') // Separa el string en un array usando la coma como delimitador
            .map((word) => word.trim()) // Elimina los espacios en blanco adicionales en cada palabra
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convierte la primera letra en mayúscula y el resto en minúscula
            .join(', '); // Vuelve a unir las palabras con coma y espacio
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.columns = [
            { header: 'name', key: 'name', width: 20 },
            { header: 'code', key: 'code', width: 15 },
            { header: 'activeIngredient', key: 'activeIngredient', width: 15 },
            { header: 'description', key: 'description', width: 15 },
            { header: 'barcode', key: 'barcode', width: 15 },
            { header: 'pharmaceuticalDescription', key: 'pharmaceuticalDescription', width: 15 },
            { header: 'pharmaceuticalDescription', key: 'pharmaceuticalDescription', width: 15 },
            { header: 'subCategory', key: 'subCategory', width: 20 }, // Columna para la categoría
            { header: 'brand', key: 'brand', width: 20 }, // Columna para la subcategoría
            { header: 'typesPresentation', key: 'typesPresentation', width: 20 }, // Columna para la subcategoría
            { header: 'concentration', key: 'concentration', width: 20 }, // Columna para la subcategoría
            { header: 'typesPackaging', key: 'typesPackaging', width: 20 }, // Columna para la subcategoría
            { header: 'unitMeasurement', key: 'unitMeasurement', width: 20 }, // Columna para la subcategoría
            { header: 'unitConcentration', key: 'unitConcentration', width: 20 }, // Columna para la subcategoría
            { header: 'quantityPackage', key: 'quantityPackage', width: 20 }, // Columna para la subcategoría
            { header: 'createdBy', key: 'createdBy', width: 25 }, // Columna para usuario creador
            { header: 'updatedBy', key: 'updatedBy', width: 25 }, // Columna para usuario que actualizó
            { header: 'createdAt', key: 'createdAt', width: 20 },
            { header: 'updatedAt', key: 'updatedAt', width: 20 },
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
                activeIngredient: item.activeIngredient,
                description: item.description,
                barcode: item.barcode,
                pharmaceuticalDescription: item.pharmaceuticalDescription
                    ? item.pharmaceuticalDescription
                    : 'Sin descripcion medica',
                subCategory: item.subCategory ? item.subCategory.id : 'N/A',
                brand: item.brand ? item.brand.id : 'N/A',
                typesPresentation: item.typesPresentation ? item.typesPresentation.id : 'N/A',
                concentration: item.concentration ? item.concentration.id : 'N/A',
                typesPackaging: item.typesPackaging ? item.typesPackaging.id : 'N/A',
                unitMeasurement: item.unitMeasurement ? item.unitMeasurement.id : 'N/A',
                unitConcentration: item.unitConcentration ? item.unitConcentration.id : 'N/A',
                quantityPackage: item.quantityPackage ? item.quantityPackage.id : 'N/A',
                createdBy: item.user ? item.user.id : 'N/A', // Si user es null, poner 'N/A'
                updatedBy: item.userUpdate ? item.userUpdate.id : 'N/A', // Si userUpdate es null, poner 'N/A'
                createdAt: item.createdAt ? item.createdAt.toISOString() : 'N/A', // Convertir a string en formato ISO
                updatedAt: item.updatedAt ? item.updatedAt.toISOString() : 'N/A', // Convertir a string en formato ISO
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
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Leer el archivo Excel desde el buffer
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja de trabajo
        const worksheet = workbook.Sheets[sheetName];

        // Convertir los datos de la hoja de Excel en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validar y mapear los datos a tu entidad
        const entities = jsonData.map((data: any) => {
            return this.catalogueRepository.create({
                name: data['name'],
                brand: data['brand'],
                activeIngredient: data['activeIngredient'],
                description: data['description'],
                barcode: data['barcode'],
                pharmaceuticalDescription: data['pharmaceuticalDescription'],
                code: data['code'],
                unitConcentration: data['unitConcentration'],
                subCategory: data['subCategory'],
                typesPresentation: data['typesPresentation'],
                concentration: data['concentration'],
                typesPackaging: data['typesPackaging'],
                unitMeasurement: data['unitMeasurement'],
                quantityPackage: data['quantityPackage'],
                user: data['createdBy'],
                userUpdate: data['updatedBy'],
            });
        });

        if (jsonData) {
            try {
                // console.log(jsonData);
                // Hacer la solicitud al API externo primero
                if (process.env.URL_SUPER_ADMIN) {
                    const response = await fetch(`${process.env.URL_SUPER_ADMIN}/sync/products`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${process.env.TOKEN_SUPER_ADMIN}`, // Añades el token Bearer en el header
                        },
                        body: JSON.stringify(jsonData),
                    });
                    // Validamos si la respuesta es correcta
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const responseData = await response.json();
                    console.log('Respuesta del servidor:', responseData);
                }

                // Si todo fue bien, guardar los datos en la base de datos
                await this.catalogueRepository.save(entities);

                // Hacer commit de la transacción solo después de guardar los datos
                await queryRunner.commitTransaction();

                return { message: 'Datos importados correctamente', total: entities.length };
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.log('Error:', error);

                if (error instanceof HttpException) {
                    throw error;
                } else {
                    throw new HttpException(
                        'Error interno del servidor',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            } finally {
                await queryRunner.release();
            }
        }
    }
}
