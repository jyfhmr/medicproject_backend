import { Test, TestingModule } from '@nestjs/testing';
import { AdjuntesController } from './adjuntes.controller';
import { AdjuntesService } from './adjuntes.service';

describe('AdjuntesController', () => {
  let controller: AdjuntesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdjuntesController],
      providers: [AdjuntesService],
    }).compile();

    controller = module.get<AdjuntesController>(AdjuntesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
