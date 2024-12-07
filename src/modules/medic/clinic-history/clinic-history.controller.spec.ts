import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryController } from './clinic-history.controller';
import { ClinicHistoryService } from './clinic-history.service';

describe('ClinicHistoryController', () => {
  let controller: ClinicHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicHistoryController],
      providers: [ClinicHistoryService],
    }).compile();

    controller = module.get<ClinicHistoryController>(ClinicHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
