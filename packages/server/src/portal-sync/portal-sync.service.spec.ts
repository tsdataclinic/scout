import { Test, TestingModule } from '@nestjs/testing';
import { PortalSyncService } from './portal-sync.service';

describe('PortalSyncService', () => {
  let service: PortalSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortalSyncService],
    }).compile();

    service = module.get<PortalSyncService>(PortalSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
