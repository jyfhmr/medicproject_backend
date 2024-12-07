import { Injectable, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasury_maintenance_Bank } from './entities/bank.entity';
import { Repository, Like, Raw, Between } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';

@Injectable()
export class BanksService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Treasury_maintenance_Bank)
        private bankRepository: Repository<Treasury_maintenance_Bank>,
    ) {}

    async findBanksWithAccounts(): Promise<Treasury_maintenance_Bank[]> {
        try {
            // Recupera todos los bancos y sus cuentas asociadas
            const banksWithAccounts = await this.bankRepository.find({
                relations: ['accounts','accounts.currencyUsed'], // Nombre correcto de la relación en plural

            });

            // Filtra solo los bancos que tengan al menos una cuenta asociada
            const filteredBanks = banksWithAccounts.filter(
                (bank) => bank.accounts && bank.accounts.length > 0,
            );

            return filteredBanks;
        } catch (error) {
            throw new HttpException(
                'Error fetching banks with accounts',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(createBankDto: CreateBankDto, userId: number): Promise<Treasury_maintenance_Bank> {
        const { name, bankCode } = createBankDto;
        const user = await this.usersService.findOne(userId);
        // Verificar si ya existe una entidad con el mismo nombre y código de banco
        const existingBankName = await this.bankRepository.findOne({ where: { name } });
        const existingBankCodeBank = await this.bankRepository.findOne({
            where: { bankCode },
        });

        if (existingBankName) {
            throw new ConflictException('EL nombre del banco ya existe.');
        }
        if (existingBankCodeBank) {
            throw new ConflictException('EL codigo del banco ya existe.');
        }

        const newBank = this.bankRepository.create(createBankDto);

        newBank.user = user;
        return await this.bankRepository.save(newBank);
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Treasury_maintenance_Bank[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            accounts: true,
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
            name: Like(`%${query.name || ''}%`),
            email: Like(`%${query.email || ''}%`),
            branch: Like(`%${query.branch || ''}%`),
            adress: Like(`%${query.adress || ''}%`),
            urbanization: Like(`%${query.urbanization || ''}%`),
            street: Like(`%${query.street || ''}%`),
            swift: Like(`%${query.swift || ''}%`),
            building: Like(`%${query.building || ''}%`),
            municipality: Like(`%${query.municipality || ''}%`),
            city: Like(`%${query.city || ''}%`),
            aba: Like(`%${query.aba || ''}%`),
            codeZip: Like(`%${query.codeZip || ''}%`),
            bankCode: Like(`%${query.bankCode || ''}%`),
            routeNumber: Like(`%${query.routeNumber || ''}%`),
            phone: Like(`%${query.phone || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.bankRepository.count({ where }),
                query?.export
                    ? this.bankRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.bankRepository.find({
                          relations,
                          where,
                          order: { id: order },
                          take,
                          skip,
                      }),
            ]);

            //console.log("LOS BANCOS",resData)

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

    async findOne(id: number, relations: string[] = []): Promise<Treasury_maintenance_Bank> {
        return await this.bankRepository.findOne({
            where: { id },
            relations,
        });
    }

    async update(id: number, updateBankDto: UpdateBankDto, userId: number) {
        const user = await this.usersService.findOne(userId);
        // Actualiza el registro correspondiente
        await this.bankRepository.update({ id: id }, updateBankDto);

        // Recupera el registro actualizado
        const updatedBank = await this.bankRepository.findOne({ where: { id: id } });

        // Establece el usuario que realizó la actualización
        if (updatedBank) {
            updatedBank.userUpdate = user;
            await this.bankRepository.save(updatedBank);
        }
        return 'This action updates Bank';
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.bankRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.bankRepository.save(updateStatus);
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
            { header: 'Nombre:', key: 'name', width: 20 },
            { header: 'Correo Electronico:', key: 'email', width: 20 },
            { header: 'Sucursal:', key: 'branch', width: 20 },
            { header: 'Dirección (corta):', key: 'adress', width: 20 },
            { header: 'Código Banco:', key: 'bankCode', width: 20 },
            { header: 'Telefono:', key: 'phone', width: 20 },
            { header: 'Aba:', key: 'aba', width: 20 },
            { header: 'Numero De Ruta:', key: 'routeNumber', width: 20 },
            { header: 'Swift:', key: 'swift', width: 20 },
            { header: 'Urbanización / Barrio:', key: 'urbanization', width: 20 },
            { header: 'Calla / Av:', key: 'street', width: 20 },
            { header: 'Casa / Edificio:', key: 'building', width: 20 },
            { header: 'Municipio / Pueblo:', key: 'municipality', width: 20 },
            { header: 'Ciudad / Banco:', key: 'city', width: 20 },
            { header: 'ZIP Code:', key: 'codeZip', width: 20 },
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
