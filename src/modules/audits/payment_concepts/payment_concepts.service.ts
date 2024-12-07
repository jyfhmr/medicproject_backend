import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentConceptDto } from './dto/create-payment_concept.dto';
import { UpdatePaymentConceptDto } from './dto/update-payment_concept.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/config/users/users.service';
import { config_admistrative_paymentConcept } from './entities/payment_concept.entity';
import { Between, DataSource, Like, Raw, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { IsrlWitholding } from './entities/isrl_witholding.entity';
import { RatesOrPorcentage } from '../rates_or_porcentage/entities/rates_or_porcentage.entity';
import { TypesPeopleIsrl } from '../types_people_isrl/entities/types_people_isrl.entity';

@Injectable()
export class PaymentConceptsService {
    constructor(
        @InjectRepository(config_admistrative_paymentConcept)
        private paymentConceptRepository: Repository<config_admistrative_paymentConcept>,
        @InjectRepository(RatesOrPorcentage)
        private ratesOrPorcentageRepository: Repository<RatesOrPorcentage>,
        @InjectRepository(TypesPeopleIsrl)
        private typesPeopleIsrlRepository: Repository<TypesPeopleIsrl>,
        private usersService: UsersService,
        private dataSource: DataSource,
    ) {}
    async create(
        createPaymentConceptDto: CreatePaymentConceptDto,
        userId: number,
    ): Promise<string> {
        const queryRunner = this.dataSource.createQueryRunner();

        console.log(createPaymentConceptDto);

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new NotFoundException('Usuario no encontrado');
            }

            if (createPaymentConceptDto.IsrlWitholdings.length <= 0) {
                throw new HttpException('Debe contener un tipo de persona', HttpStatus.NOT_FOUND);
            }

            const newConcept = this.paymentConceptRepository.create(createPaymentConceptDto);
            newConcept.user = user;
            const concept = await this.paymentConceptRepository.save(newConcept);
            console.log(concept);
            for (const data of createPaymentConceptDto.IsrlWitholdings) {
                const ratesOrPorcentage = await this.ratesOrPorcentageRepository.findOne({
                    where: { id: data.ratesOrPorcentage },
                });

                if (!ratesOrPorcentage) {
                    throw new NotFoundException('Rates or percentage not found');
                }

                const typesPeopleIsrl = await this.typesPeopleIsrlRepository.findOne({
                    where: { id: data.typesPeopleIsrl },
                });

                if (!typesPeopleIsrl) {
                    throw new NotFoundException('Types of people ISRL not found');
                }

                const newRegister = new IsrlWitholding();
                newRegister.codeSeniat = data.codeSeniat;
                newRegister.paymentConcept = concept;
                newRegister.taxBase = data.taxBase;
                newRegister.pageRangeBS = data.pageRangeBS;
                newRegister.ratesOrPorcentage = ratesOrPorcentage;
                newRegister.sustractingBS = data.sustractingBS;
                newRegister.typesPeopleIsrl = typesPeopleIsrl;

                await queryRunner.manager.save(newRegister);
            }

            await queryRunner.commitTransaction();
            return '¡Concepto creado con éxito!';
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

    async findAll(
        query: any,
    ): Promise<{ totalRows: number; data: config_admistrative_paymentConcept[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        const relations = {
            user: true,
            userUpdate: true,
            IsrlWitholdings: {
                typesPeopleIsrl: true,
                ratesOrPorcentage: true,
            },
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
            numeroLiteral: Like(`%${query.numeroLiteral || ''}%`),
            updateAt: dateRange || undefined, // Add the date range filter if it exists
            createAt: dateRange || undefined, // Add the date range filter if it exists
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined, // Simplified boolean check
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.paymentConceptRepository.count({ where }),
                query?.export
                    ? this.paymentConceptRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.paymentConceptRepository.find({
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

    async findOne(id: number): Promise<config_admistrative_paymentConcept> {
        const relations = {
            user: true,
            userUpdate: true,
            IsrlWitholdings: {
                typesPeopleIsrl: true,
                ratesOrPorcentage: true,
            },
        };
        return await this.paymentConceptRepository.findOne({ relations, where: { id: id } });
    }

    async listPaymentConcept(): Promise<config_admistrative_paymentConcept[]> {
        const relations = {
            user: true,
            userUpdate: true,
            IsrlWitholdings: {
                typesPeopleIsrl: true,
                ratesOrPorcentage: true,
            },
        };
        return await this.paymentConceptRepository.find({ relations, where: { isActive: true } });
    }

    async update(
        id: number,
        updatePaymentConceptDto: UpdatePaymentConceptDto,
        userId: number,
    ): Promise<string> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new NotFoundException('Usuario no encontrado');
            }

            const existingConcept = await this.paymentConceptRepository.findOne({
                where: { id },
                relations: ['IsrlWitholdings'],
            });

            if (!existingConcept) {
                throw new NotFoundException('Concepto de pago no encontrado');
            }

            // Actualiza las propiedades del objeto existente
            existingConcept.name = updatePaymentConceptDto.name;
            existingConcept.numeroLiteral = updatePaymentConceptDto.numeroLiteral;
            existingConcept.userUpdate = user;

            await this.paymentConceptRepository.save(existingConcept);
            console.log(updatePaymentConceptDto);

            // Actualiza los registros de IsrlWitholdings
            if (
                updatePaymentConceptDto.IsrlWitholdings &&
                updatePaymentConceptDto.IsrlWitholdings.length > 0
            ) {
                // Elimina los registros antiguos
                await queryRunner.manager.delete(IsrlWitholding, { paymentConcept: { id } });
                console.log(updatePaymentConceptDto.IsrlWitholdings);
                // Crea y guarda los registros nuevos
                for (const data of updatePaymentConceptDto.IsrlWitholdings) {
                    const newRegister = new IsrlWitholding();
                    newRegister.codeSeniat = data.codeSeniat;
                    newRegister.paymentConcept = existingConcept;
                    newRegister.taxBase = data.taxBase;
                    newRegister.pageRangeBS = data.pageRangeBS;
                    console.log(data.ratesOrPorcentage);

                    const ratesOrPorcentage = await this.ratesOrPorcentageRepository.findOne({
                        where: { id: data.ratesOrPorcentage },
                    });

                    console.log(ratesOrPorcentage);
                    console.log(data.typesPeopleIsrl);
                    if (!ratesOrPorcentage) {
                        throw new NotFoundException(
                            `Rates or Porcentage with value ${data.ratesOrPorcentage} not found`,
                        );
                    }
                    newRegister.ratesOrPorcentage = ratesOrPorcentage;

                    const typesPeopleIsrl = await this.typesPeopleIsrlRepository.findOne({
                        where: { id: data.typesPeopleIsrl },
                    });
                    console.log(typesPeopleIsrl);

                    if (!typesPeopleIsrl) {
                        throw new NotFoundException(
                            `Types People ISRL with type ${data.typesPeopleIsrl} not found`,
                        );
                    }
                    newRegister.typesPeopleIsrl = typesPeopleIsrl;

                    newRegister.sustractingBS = data.sustractingBS;

                    await queryRunner.manager.save(newRegister);
                }
            }

            await queryRunner.commitTransaction();
            return 'Concepto de pago actualizado con éxito';
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

    async changeStatus(id: number): Promise<string | Error> {
        const updateStatus = await this.paymentConceptRepository.findOneBy({ id });
        updateStatus.isActive = !updateStatus.isActive;

        try {
            await this.paymentConceptRepository.save(updateStatus);
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
            { header: 'Nombre de cuenta:', key: 'name', width: 20 },
            { header: 'Tipo de cuenta:', key: 'numeroLiteral', width: 20 },
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
