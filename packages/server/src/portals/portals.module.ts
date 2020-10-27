import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortalService } from './portal.service';
import { DatasetModule } from '../dataset/dataset.module';
import { DatasetColumnsModule } from '../dataset-columns/dataset-columns.module';
import { PortalResolver } from './portal.resolver';
import { Portal } from './portal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portal]),
    DatasetModule,
    DatasetColumnsModule,
  ],
  providers: [PortalService, PortalResolver],
  exports: [PortalService],
})
export class PortalsModule {}
