import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTypesController } from './invoice_types.controller';
import { InvoiceTypesService } from './invoice_types.service';

describe('InvoiceTypesController', () => {
  let controller: InvoiceTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceTypesController],
      providers: [InvoiceTypesService],
    }).compile();

    controller = module.get<InvoiceTypesController>(InvoiceTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
