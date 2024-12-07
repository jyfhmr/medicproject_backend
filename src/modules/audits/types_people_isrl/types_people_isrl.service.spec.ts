import { Test, TestingModule } from '@nestjs/testing';
import { TypesPeopleIsrlService } from './types_people_isrl.service';

describe('TypesPeopleIsrlService', () => {
  let service: TypesPeopleIsrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesPeopleIsrlService],
    }).compile();

    service = module.get<TypesPeopleIsrlService>(TypesPeopleIsrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
