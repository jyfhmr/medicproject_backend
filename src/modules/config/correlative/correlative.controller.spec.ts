import { Test, TestingModule } from '@nestjs/testing';
import { CorrelativeController } from './correlative.controller';
import { CorrelativeService } from './correlative.service';

describe('CorrelativeController', () => {
  let controller: CorrelativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrelativeController],
      providers: [CorrelativeService],
    }).compile();

    controller = module.get<CorrelativeController>(CorrelativeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
