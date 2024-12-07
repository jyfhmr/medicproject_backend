import { Module } from '@nestjs/common';
import { TypeOfPeopleService } from './type_of_people.service';
import { TypeOfPeopleController } from './type_of_people.controller';

@Module({
  controllers: [TypeOfPeopleController],
  providers: [TypeOfPeopleService],
})
export class TypeOfPeopleModule {}
