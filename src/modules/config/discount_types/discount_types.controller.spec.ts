import { Test, TestingModule } from '@nestjs/testing';
import { DiscountTypesController } from './discount_types.controller';
import { DiscountTypesService } from './discount_types.service';

describe('DiscountTypesController', () => {
  let controller: DiscountTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountTypesController],
      providers: [DiscountTypesService],
    }).compile();

    controller = module.get<DiscountTypesController>(DiscountTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
