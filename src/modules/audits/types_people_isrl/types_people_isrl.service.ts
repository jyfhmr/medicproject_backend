import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTypesPeopleIsrlDto } from './dto/create-types_people_isrl.dto';
import { UpdateTypesPeopleIsrlDto } from './dto/update-types_people_isrl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypesPeopleIsrl } from './entities/types_people_isrl.entity';
import { Between, Like, Raw, Repository } from 'typeorm';
import { UsersService } from 'src/modules/config/users/users.service';
;
import * as ExcelJS from 'exceljs';

@Injectable()
export class TypesPeopleIsrlService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(TypesPeopleIsrl)
        private typesPeopleIsrlRepository: Repository<TypesPeopleIsrl>,
    ) {}

    async create(
        createTypesPeopleIsrlDto: CreateTypesPeopleIsrlDto,
        userId: number,
    ): Promise<string> {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const type = await this.typesPeopleIsrlRepository.findOne({
            where: {
                type: createTypesPeopleIsrlDto.type,
            },
        });
        if (type) {
            throw new HttpException('El tipo de persona  ya se encuentra registrado', 401);
        }

        const newType = this.typesPeopleIsrlRepository.create({
            ...createTypesPeopleIsrlDto,
            type: createTypesPeopleIsrlDto.type.toUpperCase(),
            code: createTypesPeopleIsrlDto.code.toUpperCase(),
            user: user,
            userUpdate: user,
        });

        try {
            await this.typesPeopleIsrlRepository.save(newType);
            return 'El tipo de persona creado con exito';
        } catch (error) {
            console.log(error);
            throw new HttpException('Error creating category', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(query: any): Promise<{ totalRows: number; data: TypesPeopleIsrl[] }> {
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
            type: Like(`%${query.type || ''}%`),
            code: Like(`%${query.code || ''}%`),
            isActive: query.isActive !== undefined ? query.isActive : undefined,
            createdAt: createdAt || undefined,
            updateAt: updateAt || undefined, // Add the date range filter if it exists
        };

        try {
            const [resCount, resData] = await Promise.all([
                this.typesPeopleIsrlRepository.count({ relations, where }),
                query?.export
                    ? this.typesPeopleIsrlRepository.find({
                          relations,
                          where,
                          order: { id: order },
                      })
                    : this.typesPeopleIsrlRepository.find({
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
                'Error fetching types people',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listTypesPeopleISRL(): Promise<TypesPeopleIsrl[]> {
        return await this.typesPeopleIsrlRepository.find({ where: { isActive: true } });
    }

    async findOne(id: number): Promise<TypesPeopleIsrl> {
        const type = await this.typesPeopleIsrlRepository.findOne({ where: { id } });
        if (!type) {
            throw new HttpException('type not found', HttpStatus.NOT_FOUND);
        }
        return type;
    }

    async update(id: number, updateTypesPeopleIsrlDto: UpdateTypesPeopleIsrlDto) {
        const types = await this.findOne(id);
        if (!types) {
            throw new HttpException('Type not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(types, updateTypesPeopleIsrlDto);

        try {
            await this.typesPeopleIsrlRepository.save(types);
            return `This action updates a #${id} types People Isrl`;
        } catch (error) {
            throw new HttpException(
                'Error updating types People Isrl',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async changeStatus(id: number): Promise<string> {
        const type = await this.findOne(id);
        if (!type) {
            throw new HttpException('Types not found', HttpStatus.NOT_FOUND);
        }

        type.isActive = !type.isActive;

        try {
            await this.typesPeopleIsrlRepository.save(type);
            return 'Types  status changed successfully';
        } catch (error) {
            throw new HttpException(
                'Error changing types status',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} typesPeopleIsrl`;
    }
}
