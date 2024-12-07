import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMoneyDto } from './dto/create-money.dto';
import { UpdateMoneyDto } from './dto/update-money.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasury_maintenance_Money } from './entities/money.entity';
import { Repository, Like, Raw, Between } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import * as XLSX from 'xlsx';

@Injectable()
export class MoneyService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Treasury_maintenance_Money)
        private moneyRepository: Repository<Treasury_maintenance_Money>,
    ) {}

    async getPaymentMethodRelatedToCertainCurrency(currencyId: number) {
        console.log('Buscando métodos de pago relacionados a cierta moneda...');

        const searchedCurrency = await this.findOne(currencyId);

        if (!searchedCurrency) {
            throw new HttpException('La moneda no existe', 404);
        }

        const paymentMethodsWithTheSearchedCurrency = await this.moneyRepository.query(
            `
       SELECT pm.id,pm.method,pm.typeMethodPayment,pm.code FROM currencys_related_to_payment_methods crp 
       INNER JOIN treasury_maintenance_payment_method pm
       ON pm.id = crp.payment_method_id
       WHERE crp.currency_id = ? AND pm.isActive = 1
       `,
            [currencyId],
        );

        console.log('Los métodos de pago coincidentes ', paymentMethodsWithTheSearchedCurrency);

        return paymentMethodsWithTheSearchedCurrency;
    }

    async create(createMoneyDto: CreateMoneyDto, userId: number) {
        const { money, symbol } = createMoneyDto;

        const existingMoney = await this.moneyRepository.findOne({ where: { money } });
        const existingSymbol = await this.moneyRepository.findOne({
            where: { symbol },
        });

        const user = await this.usersService.findOne(userId);

        if (existingMoney) {
            throw new ConflictException('La moneda ya existe.');
        }
        if (existingSymbol) {
            throw new ConflictException('EL codigo del moneda ya existe.');
        }

        const newMoney = this.moneyRepository.create(createMoneyDto);
        newMoney.user = user;
        this.moneyRepository.save(newMoney);
        return 'This action adds a new money';
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Treasury_maintenance_Money[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
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
            money: Like(`%${query.money || ''}%`),
            symbol: Like(`%${query.symbol || ''}%`),
            updatedAt: dateRange || undefined, // Add the date range filter if it exists
            createdAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.moneyRepository.count({ where }),
                query?.export
                    ? this.moneyRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.moneyRepository.find({
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

    async findOne(id: number): Promise<Treasury_maintenance_Money> {
        return await this.moneyRepository.findOne({ where: { id: id } });
    }

    async update(id: number, updateMoneyDto: UpdateMoneyDto, userId: number) {
        const user = await this.usersService.findOne(userId);

        // Actualiza el registro correspondiente
        await this.moneyRepository.update({ id: id }, updateMoneyDto);

        // Recupera el registro actualizado
        const updatedMoney = await this.moneyRepository.findOne({ where: { id: id } });

        // Establece el usuario que realizó la actualización
        if (updatedMoney) {
            updatedMoney.userUpdate = user;
            await this.moneyRepository.save(updatedMoney);
        }

        return 'This action updates money';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.moneyRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.moneyRepository.save(updateStatus);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (err) {
            throw err;
        }
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = [
            { header: 'money', key: 'money', width: 20 },
            { header: 'symbol', key: 'symbol', width: 20 },
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
                money: item.money,
                symbol: item.symbol,
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
            return this.moneyRepository.create({
                // Asegúrate de que los nombres de las columnas en el archivo Excel sean correctos
                money: data['money'], // Reemplaza 'NombreMoneda' con el nombre exacto de la columna en tu Excel
                symbol: data['symbol'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                user: data['user'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
                userUpdate: data['userUpdate'], // Reemplaza 'SimboloMoneda' con la columna correspondiente en el Excel
            });
        });

        // Guardar los datos en la base de datos
        await this.moneyRepository.save(entities);

        return { message: 'Datos importados correctamente', total: entities.length };
    }

    async listMoney(): Promise<Treasury_maintenance_Money[]> {
        return await this.moneyRepository.find({ where: { isActive: true } });
    }
}
