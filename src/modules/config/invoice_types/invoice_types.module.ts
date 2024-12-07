import { Module } from '@nestjs/common';
import { InvoiceTypesService } from './invoice_types.service';
import { InvoiceTypesController } from './invoice_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceType } from './entities/invoice_type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([InvoiceType])],
    controllers: [InvoiceTypesController],
    providers: [InvoiceTypesService],
})
export class InvoiceTypesModule {}
