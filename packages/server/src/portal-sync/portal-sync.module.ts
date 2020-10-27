import { Module } from '@nestjs/common';
import { PortalSyncService } from './portal-sync.service';
import { PortalsModule } from '../portals/portals.module';
import { DatasetModule } from '../dataset/dataset.module';
import { DatasetColumnsModule } from '../dataset-columns/dataset-columns.module';
import { TagsModule } from '../tags/tags.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    PortalsModule,
    DatasetModule,
    DatasetColumnsModule,
    TagsModule,
    SearchModule,
  ],
  providers: [PortalSyncService],
})
export class PortalSyncModule {}
