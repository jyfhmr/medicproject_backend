import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository, Like, Raw, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
import { BanksService } from 'src/modules/treasury/maintenance/banks/banks.service';
import { Treasury_maintenance_Account } from './entities/account.entity';
import { ComissionPerPaymentMethod } from '../../comission_per_payment_method/entities/comission_per_payment_method.entity';
import { Treasury_maintenance_PaymentMethod } from '../payment_method/entities/payment_method.entity';
import { PaymentMethodService } from '../payment_method/payment_method.service';
import { MoneyService } from '../money/money.service';

@Injectable()
export class AccountService {
    constructor(
        private moneyService: MoneyService,
        private usersService: UsersService,
        private banksService: BanksService,
        private paymentMethodService: PaymentMethodService,
        @InjectRepository(Treasury_maintenance_Account)
        private accountRepository: Repository<Treasury_maintenance_Account>,
        @InjectRepository(ComissionPerPaymentMethod)
        private comissionRepository: Repository<ComissionPerPaymentMethod>, // Agrega el repositorio de comisiones
    ) { }

    async create(
        createAccountDto: CreateAccountDto,
        userId: number,
        bankId: number,
    ): Promise<Treasury_maintenance_Account> {
        const user = await this.usersService.findOne(userId);
        const bank = await this.banksService.findOne(bankId);

        // Extraer commissions y currencyUsed del DTO
        const { commissions, accountCurrency, ...accountDetails } = createAccountDto;

        // Obtener la moneda utilizando el ID proporcionado
        const currency = await this.moneyService.findOne(accountCurrency);

        // Crear la nueva cuenta sin incluir currencyUsed
        const newAccount = this.accountRepository.create(accountDetails);
        newAccount.user = user;
        newAccount.bank = bank;
        newAccount.currencyUsed = currency; // Asignar la moneda obtenida

        // Guardar la nueva cuenta
        const savedAccount = await this.accountRepository.save(newAccount);

        // Manejar comisiones asociadas (sin cambios)
        if (commissions && commissions.length > 0) {
            const comissionEntities = await Promise.all(commissions.map(async (commission) => {
                const paymentMethod = await this.paymentMethodService.findOne(commission.paymentMethodId);

                const comissionEntity = this.comissionRepository.create({
                    amount: commission.value,
                    account: savedAccount, // Asignar la cuenta recién creada a la comisión
                    type: commission.type,
                    paymentMethod: paymentMethod,
                });
                return comissionEntity;
            }));
            await this.comissionRepository.save(comissionEntities);
        }

        // Retornar la cuenta guardada
        return savedAccount;
    }


    async findAll(query: any): Promise<{ totalRows: number; data: Treasury_maintenance_Account[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = [
            'user',
            'userUpdate',
            'bank',
            'commissions',
            'commissions.paymentMethod', // Añadir esta línea para incluir el paymentMethod de las comisiones
            "currencyUsed"
        ];

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
            nameAccount: Like(`%${query.nameAccount || ''}%`),
            description: Like(`%${query.description || ''}%`),
            typeAccount: Like(`%${query.typeAccount || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.accountRepository.count({ where }),
                query?.export
                    ? this.accountRepository.find({
                        relations,
                        where,
                        order: { id: order },
                    })
                    : this.accountRepository.find({
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

    async findOne(id: number): Promise<Treasury_maintenance_Account> {

        console.log(await this.accountRepository.findOne({
            where: { id: id },
            relations: [
                'bank',
                'commissions',
                'commissions.paymentMethod', // Añadir esta línea para incluir el paymentMethod de las comisiones
                "currencyUsed"
            ],
        }))

        return await this.accountRepository.findOne({
            where: { id: id },
            relations: [
                'bank',
                'commissions',
                'commissions.paymentMethod', // Añadir esta línea para incluir el paymentMethod de las comisiones
                "currencyUsed"
            ],
        });
    }


    async update(id: number, updateAccountDto: UpdateAccountDto, userId: number) {
        const user = await this.usersService.findOne(userId);
        const accountToUpdate = await this.accountRepository.findOne({
            where: { id },
            relations: ['commissions', 'bank', "currencyUsed"],
        });

        if (!accountToUpdate) {
            throw new NotFoundException('Cuenta no encontrada');
        }

        // Extraer commissions, bank y eliminar id de accountDetails
        const { commissions, bank, id: _removedId, ...accountDetails } = updateAccountDto;

        // Actualizar detalles de la cuenta sin sobrescribir el id
        Object.assign(accountToUpdate, accountDetails);

        // Actualizar el banco si se proporciona
        if (bank) {
            const bankEntity = await this.banksService.findOne(bank);
            accountToUpdate.bank = bankEntity;
        }

        // Establecer el usuario que realizó la actualización
        accountToUpdate.userUpdate = user;

        //Guardar la moneda
        const currency = await this.moneyService.findOne(updateAccountDto.accountCurrency)
        if (!currency) {
            throw new HttpException("No se encontró la moneda con la que se intentó actualizar la cuenta", 404)
        }

        accountToUpdate.currencyUsed = currency


        // Guardar la cuenta actualizada primero
        await this.accountRepository.save(accountToUpdate);

        // Manejar las comisiones
        if (commissions) {
            // Eliminar las comisiones existentes
            if (accountToUpdate.commissions && accountToUpdate.commissions.length > 0) {
                await this.comissionRepository.remove(accountToUpdate.commissions);
            }

            // Crear nuevas comisiones
            const newCommissions = commissions.map((commission) => {
                return this.comissionRepository.create({
                    paymentMethod: commission.paymentMethodId,
                    amount: commission.value,
                    account: accountToUpdate,
                    type: commission.type,
                    user: user, // Establecer el usuario
                });
            });

            // Guardar las nuevas comisiones
            await this.comissionRepository.save(newCommissions);
        }

        return 'La cuenta ha sido actualizada con éxito';
    }




    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.accountRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.accountRepository.save(updateStatus);
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
            { header: 'Nombre de cuenta:', key: 'nameAccount', width: 20 },
            { header: 'Tipo de cuenta:', key: 'typeAccount', width: 20 },
            { header: 'Descripción:', key: 'description', width: 20 },
            { header: 'Banco:', key: 'bank', width: 20 },
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
