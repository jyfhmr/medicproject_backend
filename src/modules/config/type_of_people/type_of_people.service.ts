import { Injectable } from '@nestjs/common';
import { CreateTypeOfPersonDto } from './dto/create-type_of_person.dto';
import { UpdateTypeOfPersonDto } from './dto/update-type_of_person.dto';

@Injectable()
export class TypeOfPeopleService {
  create(createTypeOfPersonDto: CreateTypeOfPersonDto) {
    return 'This action adds a new typeOfPerson';
  }

  findAll() {
    return `This action returns all typeOfPeople`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeOfPerson`;
  }

  update(id: number, updateTypeOfPersonDto: UpdateTypeOfPersonDto) {
    return `This action updates a #${id} typeOfPerson`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeOfPerson`;
  }
}
