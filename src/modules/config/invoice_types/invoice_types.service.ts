import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceTypeDto } from './dto/create-invoice_type.dto';
import { UpdateInvoiceTypeDto } from './dto/update-invoice_type.dto';
import { UsersService } from 'src/modules/config/users/users.service';
;
import { InvoiceType } from './entities/invoice_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Raw, Repository } from 'typeorm';

@Injectable()
export class InvoiceTypesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(InvoiceType) private invoiceTypeRepository: Repository<InvoiceType>,
    ) {}

    async create(createInvoiceTypeDto: CreateInvoiceTypeDto, userId: number): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const newBrand = {
            ...createInvoiceTypeDto,
            name: createInvoiceTypeDto.name.toUpperCase(),
        };

        try {
            await this.invoiceTypeRepository.save(newBrand);

            return 'Type invoice created successfully';
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error creating type invoice',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: InvoiceType[] }> {
        const take = query.rows || 5;
        const skip = query.page ? (query.page - 1) * take : 0;
        const order = query.order || 'DESC';

        // const relations = {
        //     user: true,
        //     userUpdate: true,
        // };

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
            isActive: query.isActive != '' ? query.isActive : undefined,
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Add the date range filter if it exists
        };
        try {
            const [resCount, resData] = await Promise.all([
                this.invoiceTypeRepository.count({ where }),
                query?.export
                    ? this.invoiceTypeRepository.find({
                          where,
                          order: { id: order },
                      })
                    : this.invoiceTypeRepository.find({
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
            throw new HttpException(
                'Error fetching invoice type',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} invoiceType`;
    }

    update(id: number, updateInvoiceTypeDto: UpdateInvoiceTypeDto) {
        return `This action updates a #${id} invoiceType`;
    }

    remove(id: number) {
        return `This action removes a #${id} invoiceType`;
    }

    async listTypes(): Promise<InvoiceType[]> {
        return this.invoiceTypeRepository.find();
    }
}
