import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsResolver } from './collections.resolver';

describe('CollectionsResolver', () => {
  let resolver: CollectionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionsResolver],
    }).compile();

    resolver = module.get<CollectionsResolver>(CollectionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
