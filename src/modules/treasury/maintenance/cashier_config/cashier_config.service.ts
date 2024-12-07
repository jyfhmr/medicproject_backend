import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCashierConfigDto } from './dto/create-cashier_config.dto';
import { UpdateCashierConfigDto } from './dto/update-cashier_config.dto';
import { UsersService } from 'src/modules/config/users/users.service';
import { CashierConfig } from './entities/cashier_config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import puppeteer from 'puppeteer';

@Injectable()
export class CashierConfigService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(CashierConfig)
        private cashierConfigRepository: Repository<CashierConfig>,
    ) { }

    async create(
        createCashierConfigDto: CreateCashierConfigDto,
        userId: number,
    ): Promise<CashierConfig> {
        const user = await this.usersService.findOne(userId);
        // Verificar si ya existe una entidad con el mismo nombre y código de banco

        const newReason = this.cashierConfigRepository.create(createCashierConfigDto);

        newReason.user = user;

        await this.cashierConfigRepository.save(newReason);
        return;
    }
    async findAll(query: any): Promise<{ totalRows: number; data: CashierConfig[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            money: true,
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
            updatedAt: dateRange || undefined, // Add the date range filter if it exists
            createdAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.cashierConfigRepository.count({ where }),
                query?.export
                    ? this.cashierConfigRepository.find({
                        relations,
                        where,
                        order: { id: order },
                    })
                    : this.cashierConfigRepository.find({
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

    async findOne(id: number): Promise<CashierConfig> {
        const relations = {
            user: true,
            userUpdate: true,
            money: true,
        };
        return await this.cashierConfigRepository.findOne({ where: { id: id }, relations });
    }

    async update(id: number, updateCashierConfigDto: UpdateCashierConfigDto, userId: number) {
        const user = await this.usersService.findOne(userId);

        // Actualiza el registro correspondiente
        await this.cashierConfigRepository.update({ id: id }, updateCashierConfigDto);

        // Recupera el registro actualizado
        const updatedMoney = await this.cashierConfigRepository.findOne({ where: { id: id } });

        // Establece el usuario que realizó la actualización
        if (updatedMoney) {
            updatedMoney.userUpdate = user;
            await this.cashierConfigRepository.save(updatedMoney);
        }

        return 'This action updates taxes';
    }

    async findRegisterCashiersWithThisCurrencyId(currencyId: number): Promise<CashierConfig> {


        const registerCashiersThatMatch = await this.cashierConfigRepository.query(
            `
       SELECT cr.* FROM treasury_maintenance_money mon
       INNER JOIN treasury_maintenance_cashier_config cr
       ON mon.id = cr.moneyId
       WHERE cr.moneyId = ? AND cr.isActive = 1
       `,
            [currencyId],
        );

        console.log("las cajas registradoras que hacen match",registerCashiersThatMatch)

        return registerCashiersThatMatch
    }

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.cashierConfigRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.cashierConfigRepository.save(updateStatus);
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

    async listMoney(): Promise<CashierConfig[]> {
        return await this.cashierConfigRepository.find({ where: { isActive: true } });
    }

    async generatePdfFromHtml(data: any, res: Response) {
        try {
            // Lanzar un navegador Chromium controlado por Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            const balance = JSON.parse(data.motiveBalances);
            console.log(data);
            // Configurar el contenido HTML que será convertido en PDF
            const htmlContent = `
          <html>
              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          padding: 20px;
                          background-color: #f5f5f5;
                      }
                      .invoice-box {
                          background-color: #fff;
                          border: 1px solid #eee;
                          padding: 20px;
                          border-radius: 10px;
                          max-width: 800px;
                          margin: auto;
                      }
                      h1, h2, h3 {
                          text-align: center;
                      }
                      table {
                          width: 100%;
                          line-height: inherit;
                          text-align: left;
                          border-collapse: collapse;
                      }
                      table td {
                          padding: 5px;
                          vertical-align: top;
                      }
                      table tr td:nth-child(2) {
                          text-align: right;
                      }
                      table th {
                          background-color: #f2f2f2;
                          padding: 10px;
                      }
                      .total {
                          background-color: #f2f2f2;
                          font-weight: bold;
                      }
                  </style>
              </head>
              <body>
                  <div class="invoice-box">
                      <h1>Nota de Crédito</h1>
                      <h3>Número de Nota de Crédito: ${data.numberCreditNote}</h3>
                      
                      <table>
                          <tr>
                              <td>
                                  <strong>Fecha de Emisión:</strong> ${data.createAtDebit.toLocaleDateString()}<br>
                                  <strong>Cliente:</strong> ${data.company.businessName}<br>
                                  <strong>Dirección:</strong> ${data.address}<br>
                                  <strong>Número de Factura Original:</strong> ${data.controlNumber}<br>
                              </td>
                          </tr>
                      </table>
      
                      <h2>Resumen de la Nota de Crédito</h2>
                      
                      <table border="1">
      <tr>
          <th>Descripción</th>
          <th>Precio Unitario</th>
          <th>Total</th>
      </tr>
      ${data.motive
                    .map(
                        (motiveItem) => `
          <tr>
              <td>Motivo: ${motiveItem.description}</td>
              <td>${balance[motiveItem.id]}</td>
              <td>${balance[motiveItem.id]}</td>
          </tr>
      `,
                    )
                    .join('')}
      <tr class="total">
          <td colspan="3">Total:</td>
          <td>${data.total}</td>
      </tr>
  </table>
                      
                      <br>
      
                      <h2>Detalles Financieros</h2>
                      <table>
                          <tr>
                              <td><strong>Subtotal:</strong></td>
                              <td>${data.subtotal}</td>
                          </tr>
                          <tr>
                              <td><strong>IVA (${data.vat}%):</strong></td>
                              <td>${(data.subtotal * data.vat) / 100}</td>
                          </tr>
                          <tr>
                              <td><strong>Total con IVA:</strong></td>
                              <td>${data.total}</td>
                          </tr>
                          <tr>
                              <td><strong>Descuento aplicado:</strong></td>
                              <td>${data.discount}</td>
                          </tr>
                          <tr class="total">
                              <td><strong>Total a favor del cliente:</strong></td>
                              <td>${data.balance}</td>
                          </tr>
                      </table>
      
                      <h3>Gracias por su preferencia</h3>
                  </div>
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
