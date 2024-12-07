import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDiscountTypeDto } from './dto/create-discount_type.dto';
import { UpdateDiscountTypeDto } from './dto/update-discount_type.dto';
import { UsersService } from 'src/modules/config/users/users.service';
;
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountType } from './entities/discount_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountTypesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(DiscountType) private discountTypeRepository: Repository<DiscountType>,
    ) {}

    async create(createDiscountTypeDto: CreateDiscountTypeDto, userId: number): Promise<string> {
        const user = await this.usersService.findOne(userId);

        const discountType = {
            ...createDiscountTypeDto,
            name: createDiscountTypeDto.name.toUpperCase(),
        };

        try {
            await this.discountTypeRepository.save(discountType);

            return 'Type discount created successfully';
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error creating type discount',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async listTypes(): Promise<DiscountType[]> {
        return this.discountTypeRepository.find();
    }

    findAll() {
        return `This action returns all discountTypes`;
    }

    findOne(id: number) {
        return `This action returns a #${id} discountType`;
    }

    update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
        return `This action updates a #${id} discountType`;
    }

    remove(id: number) {
        return `This action removes a #${id} discountType`;
    }
}
