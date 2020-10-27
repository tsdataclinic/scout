import { Test, TestingModule } from '@nestjs/testing';
import { DatasetController } from './dataset.controller';

describe('DatasetController', () => {
  let controller: DatasetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetController],
    }).compile();

    controller = module.get<DatasetController>(DatasetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
