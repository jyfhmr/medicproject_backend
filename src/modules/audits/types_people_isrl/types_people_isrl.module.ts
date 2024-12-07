import { Module } from '@nestjs/common';
import { TypesPeopleIsrlService } from './types_people_isrl.service';
import { TypesPeopleIsrlController } from './types_people_isrl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesPeopleIsrl } from './entities/types_people_isrl.entity';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([TypesPeopleIsrl]), UsersModule],
    controllers: [TypesPeopleIsrlController],
    providers: [TypesPeopleIsrlService],
    exports: [TypeOrmModule],
})
export class TypesPeopleIsrlModule {}
