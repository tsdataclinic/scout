import { forwardRef, Module } from '@nestjs/common';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetResolver } from './dataset.resolver';
import { Dataset } from './dataset.entity';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dataset]),
    forwardRef(() => SearchModule),
  ],
  controllers: [DatasetController],
  providers: [DatasetService, DatasetResolver],
  exports: [DatasetService],
})
export class DatasetModule {}
