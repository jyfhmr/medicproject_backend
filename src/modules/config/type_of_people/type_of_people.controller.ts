import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeOfPeopleService } from './type_of_people.service';
import { CreateTypeOfPersonDto } from './dto/create-type_of_person.dto';
import { UpdateTypeOfPersonDto } from './dto/update-type_of_person.dto';

@Controller('type-of-people')
export class TypeOfPeopleController {
  constructor(private readonly typeOfPeopleService: TypeOfPeopleService) {}

  @Post()
  create(@Body() createTypeOfPersonDto: CreateTypeOfPersonDto) {
    return this.typeOfPeopleService.create(createTypeOfPersonDto);
  }

  @Get()
  findAll() {
    return this.typeOfPeopleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeOfPeopleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeOfPersonDto: UpdateTypeOfPersonDto) {
    return this.typeOfPeopleService.update(+id, updateTypeOfPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeOfPeopleService.remove(+id);
  }
}
