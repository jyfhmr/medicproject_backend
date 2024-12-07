import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    ConflictException,
} from '@nestjs/common';
import { DiscountTypesService } from './discount_types.service';
import { CreateDiscountTypeDto } from './dto/create-discount_type.dto';
import { UpdateDiscountTypeDto } from './dto/update-discount_type.dto';

@Controller('config/administrative/discount-types')
export class DiscountTypesController {
    constructor(private readonly discountTypesService: DiscountTypesService) {}

    @Post()
    async create(@Body() createDiscountTypeDto: CreateDiscountTypeDto, @Request() req: any) {
        try {
            return await this.discountTypesService.create(createDiscountTypeDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('list')
    listTypes() {
        return this.discountTypesService.listTypes();
    }

    @Get()
    findAll() {
        return this.discountTypesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.discountTypesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDiscountTypeDto: UpdateDiscountTypeDto) {
        return this.discountTypesService.update(+id, updateDiscountTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.discountTypesService.remove(+id);
    }
}
