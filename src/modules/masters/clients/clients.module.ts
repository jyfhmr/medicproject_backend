import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { UsersModule } from 'src/modules/config/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]) ],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {}
