import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'node:fs';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Company) private companiesRepository: Repository<Company>,
    ) {}

    transformBooleanFields(dto: any, fields: string[]): any {
        const transformedDto = { ...dto };
        fields.forEach((field) => {
            if (transformedDto[field] === 'true') {
                transformedDto[field] = true;
            } else if (transformedDto[field] === 'false') {
                transformedDto[field] = false;
            }
        });
        return transformedDto;
    }

    async create(
        createCompanyDto: CreateCompanyDto,
        userId: number,
        files: any,
    ): Promise<string | Error> {
        console.log('PETICION LLEGANDO', createCompanyDto);

        const user = await this.usersService.findOne(userId);

        const transformedDto = this.transformBooleanFields(createCompanyDto, ['isHeadquarters']);

        const newCompany = {
            ...transformedDto,
            user,
            userUpdate: user,
            logo: files.logo ? files.logo[0].filename : undefined,
            rifFile: files.rifFile ? files.rifFile[0].filename : undefined,
            rifLegalRepresentativeFile: files.rifLegalRepresentativeFile
                ? files.rifLegalRepresentativeFile[0].filename
                : undefined,
            seal: files.sealFile ? files.sealFile[0].filename : undefined,
            signature: files.signatureFile ? files.signatureFile[0].filename : undefined,
        };

        try {
            await this.companiesRepository.save(newCompany);
            return '¡Empresa creada con éxito!';
        } catch (error) {
            console.log('ERROR', error);
            throw error;
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: Company[] }> {
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
            name: Like(`%${query.name || ''}%`),
            updatedAt: dateRange || undefined, // Add the date range filter if it exists
            createdAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.companiesRepository.count({ where }),
                query?.export
                    ? this.companiesRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.companiesRepository.find({
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

    async findOne(id: number): Promise<Company> {
        return await this.companiesRepository.findOne({
            where: { id },
            relations: {
                documentTypeLegalRepresentative: { identificationType: true },
            },
        });
    }

    async update(
        id: number,
        updateCompanyDto: UpdateCompanyDto,
        userId: number,
        files: any,
    ): Promise<string | Error> {
        console.log(updateCompanyDto);

        const user = await this.usersService.findOne(userId);
        const company = await this.companiesRepository.findOneBy({ id });
        const oldImageLogo = company.logo;
        const oldImageRif = company.rifFile;
        const oldImageRifLegalRepresentativeFile = company.rifLegalRepresentativeFile;
        const oldSealFile = company.seal;
        const oldSignatureFile = company.signature;

        const updateCompany: any = {
            ...company,
            ...updateCompanyDto,
            userUpdate: user,
            logo: files.logo[0].filename,
            rifFile: files.rifFile[0].filename,
            rifLegalRepresentativeFile: files.rifLegalRepresentativeFile[0].filename,
            seal: files.sealFile ? files.sealFile[0].filename : undefined,
            signature: files.signatureFile ? files.signatureFile[0].filename : undefined,
        };

        try {
            await this.companiesRepository.save(updateCompany);
            oldImageLogo && fs.unlinkSync(`./uploads/companies/${oldImageLogo}`);
            oldImageRif && fs.unlinkSync(`./uploads/companies/${oldImageRif}`);
            oldSealFile && fs.unlinkSync(`./uploads/companies/${oldSealFile}`);
            oldSignatureFile && fs.unlinkSync(`./uploads/companies/${oldSignatureFile}`);
            oldImageRifLegalRepresentativeFile &&
                fs.unlinkSync(`./uploads/companies/${oldImageRifLegalRepresentativeFile}`);
            return '¡Empresa editada con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateCompany = await this.companiesRepository.findOneBy({ id });
        updateCompany.isActive = !updateCompany.isActive;

        try {
            await this.companiesRepository.save(updateCompany);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async listCompanies(): Promise<Company[]> {
        return await this.companiesRepository.find({ where: { isActive: true } });
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.addRow(['Reporte de Datos']);
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Dirección', key: 'address', width: 20 },
            { header: 'Telefono', key: 'phone', width: 20 },
            { header: 'Correo electronico', key: 'email', width: 20 },
            { header: 'RIF', key: 'rif', width: 20 },
        ];
        // Aplicar estilos a la cabecera
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

        // Configurar el encabezado de la respuesta HTTP
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename=data.xlsx`);

        // Escribir el libro de trabajo en la respuesta HTTP
        await workbook.xlsx.write(res);
        res.end();
    }
}
