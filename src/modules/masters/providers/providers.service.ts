import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UsersService } from 'src/modules/config/users/users.service';
// import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ProvidersService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Provider) private providersRepository: Repository<Provider>,
        private dataSource: DataSource,
    ) {}

    async create(createProviderDto: CreateProviderDto, userId: number): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const newProvider = this.providersRepository.create({
            user,
            businessName: createProviderDto.businessName,
            tradeName: createProviderDto.tradeName,
            identification: createProviderDto.identification,
            documentType: createProviderDto.documentType,
            phone: createProviderDto.phone,
            email: createProviderDto.email,
            city: createProviderDto.city,
            address: createProviderDto.address,
            typePeopleIsrl: createProviderDto.typePeopleIsrl,
            website: createProviderDto.website,
            taxpayer: createProviderDto.taxpayer,
            taxRetentionPercentage: createProviderDto.taxRetentionPercentage,
            paymentConcepts: createProviderDto.paymentConcepts,
            legalRepresentativeName: createProviderDto.legalRepresentativeName,
            legalRepresentativeLastName: createProviderDto.legalRepresentativeLastName,
            constitutionDate: createProviderDto.constitutionDate,
            userUpdate: user, // assuming the user creating is also the updater initially
        });

        try {
            await queryRunner.manager.save(newProvider);
            await queryRunner.commitTransaction();
            return 'Provider created successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
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

    async findAll(query: any): Promise<{ totalRows: number; data: Provider[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            city: { state: true },
            documentType: {
                identificationType: true,
            },
            taxpayer: true,
            paymentConcepts: {
                IsrlWitholdings: {
                    typesPeopleIsrl: true,
                    ratesOrPorcentage: true,
                },
            },
            typePeopleIsrl: true,
        };

        const where = {
            id: Raw((id) => `CAST(${id} as char) Like '%${query.id || ''}%'`),
            businessName: Like(`%${query.businessName || ''}%`),
            tradeName: Like(`%${query.tradeName || ''}%`),
            isActive: query.isActive ? query.isActive : true,
            city: query.city && {
                name: Like(`%${query.city || ''}%`),
            },
            taxpayer: query.taxpayer && {
                name: Like(`%${query.taxpayer || ''}%`),
            },
        };
        try {
            const getCount = this.providersRepository.count({ relations, where });
            const getData = this.providersRepository.find({
                relations,
                where,
                order: { id: order },
                take: !query?.export && take,
                skip: !query?.export && skip,
            });
            const [resCount, resData] = await Promise.all([getCount, getData]);
            return {
                totalRows: resCount,
                data: resData,
            };
        } catch (error) {
            console.log(error);
            throw new HttpException('Error fetching providers', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<Provider> {
        const provider = await this.providersRepository.findOne({
            where: { id },
            relations: {
                city: { state: true },
                taxpayer: true,
                documentType: { identificationType: true },
                paymentConcepts: {
                    IsrlWitholdings: {
                        typesPeopleIsrl: true,
                        ratesOrPorcentage: true,
                    },
                },
                typePeopleIsrl: true,
                taxRetentionPercentage: true,
            },
        });
        if (!provider) throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
        return provider;
    }

    async listProviders(): Promise<Provider[]> {
        return await this.providersRepository.find({ where: { isActive: true } });
    }

    async update(id: number, updateProviderDto: UpdateProviderDto, userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await this.usersService.findOne(userId);
        const providers = await this.findOne(id);
        if (!providers) throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);

        providers.tradeName = updateProviderDto.tradeName;
        providers.identification = updateProviderDto.identification;
        providers.businessName = updateProviderDto.businessName;
        providers.documentType = updateProviderDto.documentType;
        providers.phone = updateProviderDto.phone;
        providers.email = updateProviderDto.email;
        providers.city = updateProviderDto.city;
        providers.address = updateProviderDto.address;
        providers.typePeopleIsrl = updateProviderDto.typePeopleIsrl;
        providers.website = updateProviderDto.website;
        providers.taxpayer = updateProviderDto.taxpayer;
        providers.taxRetentionPercentage = updateProviderDto.taxRetentionPercentage;
        providers.paymentConcepts = updateProviderDto.paymentConcepts;
        providers.legalRepresentativeName = updateProviderDto.legalRepresentativeName;
        providers.legalRepresentativeLastName = updateProviderDto.legalRepresentativeLastName;
        providers.constitutionDate = updateProviderDto.constitutionDate;
        providers.userUpdate = user; // assuming the user creating is also the updater initially

        try {
            await queryRunner.manager.save(providers);
            await queryRunner.commitTransaction();

            return `Provider #${id} updated successfully`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
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

    async remove(id: number) {
        const provider = await this.findOne(id);
        if (!provider) throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);

        try {
            await this.providersRepository.remove(provider);
            return `Provider #${id} removed successfully`;
        } catch (error) {
            throw new HttpException('Error removing providers', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateProvider = await this.providersRepository.findOneBy({ id });
        updateProvider.isActive = !updateProvider.isActive;

        try {
            await this.providersRepository.save(updateProvider);
            return '¡Cambio de estatus realizado con éxito!';
        } catch (error) {
            throw error;
        }
    }

    async getAllBanks(): Promise<Provider[]> {
        return this.providersRepository.find();
    }

    async exportDataToExcel(data: any[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.addRow(['Reporte de Datos']);
        worksheet.columns = [
            { header: 'Provedor', key: 'name', width: 20 },
            { header: 'Direccion', key: 'address', width: 20 },
            { header: 'Sitio web', key: 'website', width: 20 },
            { header: 'Porcentaje de retencion', key: 'taxRetentionPercentaje', width: 20 },
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

    async generatePdfFromHtml(provider: any, res: Response) {
        try {
            // Lanzar un navegador Chromium controlado por Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Configurar el contenido HTML que será convertido en PDF
            const htmlContent = `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 10px;
                  }
                  h1 {
                    color: blue;
                    text-align: center;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  table, th, td {
                    border: 1px solid black;
                  }
                  th, td {
                    padding: 8px;
                    text-align: left;
                  }
                </style>
              </head>
              <body>
                <h1>Detalles del Proveedor</h1>
                <p><strong>Nombre Comercial:</strong> ${provider.businessName}</p>
                <p><strong>Razón Social:</strong> ${provider.tradeName}</p>
                <p><strong>Teléfono:</strong> ${provider.phone}</p>
                <p><strong>Correo Electrónico:</strong> ${provider.email}</p>
                <p><strong>Dirección:</strong> ${provider.address}</p>
                <p><strong>Representante Legal:</strong> ${provider.legalRepresentativeName} ${provider.legalRepresentativeLastName}</p>
                <p><strong>Fecha de Constitución:</strong> ${provider.constitutionDate}</p>
                <p><strong>Ciudad:</strong> ${provider.city.name}, ${provider.city.state.name}</p>
                <p><strong>Tipo de Proveedor ISRL:</strong> ${provider.typePeopleIsrl.type} ${provider.typePeopleIsrl.code}</p>
                
                <h2>Conceptos de Pago y Retenciones ISLR</h2>
                ${provider.paymentConcepts
                    .map(
                        (concept: any) => `
                  <h3>${concept.name} (${concept.numeroLiteral})</h3>
                  <table>
                    <tr>
                      <th>Código SENIAT</th>
                      <th>Base Imponible</th>
                      <th>Rango BS</th>
                      <th>Sustraendo BS</th>
                      <th>Porcentaje</th>
                    </tr>
                    ${concept.IsrlWitholdings.map((witholding: any) =>
                        provider.typePeopleIsrl.type == witholding.typesPeopleIsrl.type
                            ? `
                
                      <tr>
                        <td>${witholding.codeSeniat}</td>
                        <td>${witholding.taxBase}</td>
                        <td>${witholding.pageRangeBS || '0.0'}</td>
                        <td>${witholding.sustractingBS || '0.0'}</td>
                        <td>${witholding.ratesOrPorcentage.value}</td>
                      </tr>
                    `
                            : '',
                    ).join('')}
                  </table>
                `,
                    )
                    .join('')}
              </body>
            </html>
          `;

            // Configurar el contenido HTML en la página
            await page.setContent(htmlContent);

            // Generar el PDF
            const pdfBuffer = await page.pdf({
                format: 'A4', // Formato del PDF
                printBackground: true, // Incluir fondos en el PDF
            });

            // Cerrar el navegador
            await browser.close();

            // Configurar los encabezados de la respuesta
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=generated.pdf',
                'Content-Length': pdfBuffer.length,
            });

            // Enviar el PDF generado como respuesta
            res.end(pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
        }
    }
}
