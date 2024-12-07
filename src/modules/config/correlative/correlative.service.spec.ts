import { Test, TestingModule } from '@nestjs/testing';
import { CorrelativeService } from './correlative.service';

describe('CorrelativeService', () => {
  let service: CorrelativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrelativeService],
    }).compile();

    service = module.get<CorrelativeService>(CorrelativeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
