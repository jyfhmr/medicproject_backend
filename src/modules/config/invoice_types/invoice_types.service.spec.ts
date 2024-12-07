import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTypesService } from './invoice_types.service';

describe('InvoiceTypesService', () => {
  let service: InvoiceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceTypesService],
    }).compile();

    service = module.get<InvoiceTypesService>(InvoiceTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
