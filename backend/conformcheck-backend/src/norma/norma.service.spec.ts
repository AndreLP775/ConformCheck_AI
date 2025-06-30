import { Test, TestingModule } from '@nestjs/testing';
import { NormaService } from './norma.service';

describe('NormaService', () => {
  let service: NormaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormaService],
    }).compile();

    service = module.get<NormaService>(NormaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
