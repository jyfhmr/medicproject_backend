import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeOfMovementService } from './type_of_movement.service';
import { CreateTypeOfMovementDto } from './dto/create-type_of_movement.dto';
import { UpdateTypeOfMovementDto } from './dto/update-type_of_movement.dto';

@Controller('type-of-movement')
export class TypeOfMovementController {
    constructor(private readonly typeOfMovementService: TypeOfMovementService) {}

    @Post()
    create(@Body() createTypeOfMovementDto: CreateTypeOfMovementDto) {
        return this.typeOfMovementService.create(createTypeOfMovementDto);
    }

    @Get()
    findAll() {
        return this.typeOfMovementService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.typeOfMovementService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTypeOfMovementDto: UpdateTypeOfMovementDto) {
        return this.typeOfMovementService.update(+id, updateTypeOfMovementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.typeOfMovementService.remove(+id);
    }
}
