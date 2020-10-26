import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetColumn } from './dataset-column.entity';
import { DatasetColumnsService } from './dataset-columns.service';
import { DatasetColumnsResolver } from './dataset-columns.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([DatasetColumn])],
  providers: [DatasetColumnsService, DatasetColumnsResolver],
  exports: [DatasetColumnsService],
})
export class DatasetColumnsModule {}
