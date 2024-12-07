import { Test, TestingModule } from '@nestjs/testing';
import { AdjuntesService } from './adjuntes.service';

describe('AdjuntesService', () => {
  let service: AdjuntesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdjuntesService],
    }).compile();

    service = module.get<AdjuntesService>(AdjuntesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
