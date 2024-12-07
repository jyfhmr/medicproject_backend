import { Test, TestingModule } from '@nestjs/testing';
import { TypesPeopleIsrlController } from './types_people_isrl.controller';
import { TypesPeopleIsrlService } from './types_people_isrl.service';

describe('TypesPeopleIsrlController', () => {
  let controller: TypesPeopleIsrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesPeopleIsrlController],
      providers: [TypesPeopleIsrlService],
    }).compile();

    controller = module.get<TypesPeopleIsrlController>(TypesPeopleIsrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
