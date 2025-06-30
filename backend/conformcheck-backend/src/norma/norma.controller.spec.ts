import { Test, TestingModule } from '@nestjs/testing';
import { NormaController } from './norma.controller';

describe('NormaController', () => {
  let controller: NormaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormaController],
    }).compile();

    controller = module.get<NormaController>(NormaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
